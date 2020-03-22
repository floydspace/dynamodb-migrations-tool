import * as AWS from 'aws-sdk';
import * as AWSMock from 'aws-sdk-mock';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import DynamoDBStorage from '../../src/storages/dynamodb';

describe('DynamoDBStorage tests', () => {
  beforeAll((done) => {
    AWSMock.setSDKInstance(AWS);
    done();
  });

  it('Should dynamodb option throw', async () => {
    const constructor = () => new DynamoDBStorage({ dynamodb: new AWS.DynamoDB() as never });
    expect(constructor).toThrowError(/^"dynamodb" must be a DocumentClient instance$/);
  });

  it('Should get migrations', async () => {
    const spy = jest.fn((params: DocumentClient.QueryInput, callback: Function) => {
      callback(null, { Items: [{ executed: 'OK', name: 'bar' }] });
    });
    AWSMock.mock('DynamoDB.DocumentClient', 'query', spy);

    const migrations = await new DynamoDBStorage({}).executed();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(migrations).toHaveLength(1);
    expect(migrations[0]).toEqual('bar');

    AWSMock.restore('DynamoDB.DocumentClient');
  });

  it('Should get paginated migrations', async () => {
    const spy = jest.fn((params: DocumentClient.QueryInput, callback: Function) => {
      callback(null, params.ExclusiveStartKey
        ? { Items: [{ executed: 'OK', name: 'bar' }] }
        : { Items: [{ executed: 'OK', name: 'foo' }], LastEvaluatedKey: {} }
      );
    });
    AWSMock.mock('DynamoDB.DocumentClient', 'query', spy);

    const migrations = await new DynamoDBStorage({}).executed();

    expect(spy).toHaveBeenCalledTimes(2);
    expect(migrations).toHaveLength(2);
    expect(migrations[0]).toEqual('foo');
    expect(migrations[1]).toEqual('bar');

    AWSMock.restore('DynamoDB.DocumentClient');
  });

  it('Should apply a migration', async () => {
    const spy = jest.fn((params: DocumentClient.PutItemOutput, callback: Function) => {
      callback(null);
    });
    AWSMock.mock('DynamoDB.DocumentClient', 'put', spy);

    const migrationName = 'foo';
    await new DynamoDBStorage({}).logMigration(migrationName);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toEqual({ TableName: 'migrations', Item: { name: migrationName, executed: 'OK' } });

    AWSMock.restore('DynamoDB.DocumentClient');
  });

  it('Should apply a migration with timestamp', async () => {
    const spy = jest.fn((params: DocumentClient.PutItemOutput, callback: Function) => {
      callback(null);
    });
    AWSMock.mock('DynamoDB.DocumentClient', 'put', spy);

    const now = Date.now();
    jest.spyOn(Date, 'now').mockImplementation(() => now);

    const migrationName = 'foo';
    await new DynamoDBStorage({ timestamp: true }).logMigration(migrationName);

    const etalon = { TableName: 'migrations', Item: { name: migrationName, executed: 'OK', createdAt: now } };
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toEqual(etalon);

    AWSMock.restore('DynamoDB.DocumentClient');
  });

  it('Should rollback a migration', async () => {
    const spy = jest.fn((params: DocumentClient.PutItemOutput, callback: Function) => {
      callback(null);
    });
    AWSMock.mock('DynamoDB.DocumentClient', 'delete', spy);

    const migrationName = 'foo';
    await new DynamoDBStorage({}).unlogMigration(migrationName);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toEqual({ TableName: 'migrations', Key: { name: migrationName, executed: 'OK' } });

    AWSMock.restore('DynamoDB.DocumentClient');
  });
});
