const runActions = jest.fn();
const getGenerator = jest.fn().mockReturnValue({ runActions });
const nodePlop = jest.fn().mockReturnValue({ getGenerator });
jest.mock('node-plop', () => ({ __esModule: true, default: nodePlop }));

import * as AWS from 'aws-sdk';
import * as AWSMock from 'aws-sdk-mock';
import mockdate from 'mockdate';

import { Migrator } from '../../src/core/migrator';

describe('Migrator tests', () => {
  beforeAll((done) => {
    AWSMock.setSDKInstance(AWS);
    mockdate.set(Date.UTC(2020, 4, 11));
    done();
  });

  it('Should not migrator factory be thrown', async () => {
    const factory = () => new Migrator();
    expect(factory).not.toThrow();
  });

  it('Should run generator action', async () => {
    const migrator = new Migrator();

    await migrator.generate('test');

    expect(nodePlop).toBeCalled();
    expect(getGenerator).toBeCalled();
    expect(getGenerator).toBeCalledWith('migration');
    expect(runActions).toBeCalledTimes(1);
    expect(runActions).toBeCalledWith({timestamp: '20200511000000', name: 'test', migrationsPath: 'migrations'});
  });

  afterAll((done) => {
    mockdate.reset();
    done();
  });
});
