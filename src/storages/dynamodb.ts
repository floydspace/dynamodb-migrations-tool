import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { sort } from 'ramda';
import { Storage } from 'umzug';

const RESOURCE_NOT_FOUND_EXCEPTION = 'ResourceNotFoundException';
interface DynamoDBStorageOptions {
  dynamodb?: AWS.DynamoDB;
  documentClient?: DocumentClient;
  tableName?: string;
  attributeName?: string;
  timestamp?: boolean;
}

/**
 * @class DynamoDBStorage
 */
export default class DynamoDBStorage implements Storage {
  private dynamodb: AWS.DynamoDB;
  private documentClient: DocumentClient;
  private tableName: string;
  private attributeName: string;
  private timestamp: boolean;

  /**
   * Constructs DynamoDB table storage.
   *
   * @param options
   * @param options.dynamodb - a DynamoDB instance
   * @param options.documentClient - a DynamoDB document client instance
   * @param options.tableName - name of migration table in DynamoDB
   * @param options.attributeName - name of the table primaryKey attribute in DynamoDB
   * @param options.timestamp - option to add timestamps to the DynamoDB table
   */
  constructor({ dynamodb, documentClient, tableName, attributeName, timestamp }: DynamoDBStorageOptions = {}) {
    if (dynamodb && !(dynamodb instanceof AWS.DynamoDB)) {
      throw new Error('"dynamodb" must be a AWS.DynamoDB instance');
    }
    if (documentClient && !(documentClient instanceof DocumentClient)) {
      throw new Error('"documentClient" must be a DocumentClient instance');
    }
    this.dynamodb = dynamodb || new AWS.DynamoDB();
    this.documentClient = documentClient || new DocumentClient({ service: this.dynamodb });
    this.tableName = tableName || 'migrations';
    this.attributeName = attributeName || 'name';
    this.timestamp = timestamp || false;
  }

  /**
   * Logs migration to be considered as executed.
   *
   * @param migrationName - Name of the migration to be logged.
   */
  async logMigration(migrationName: string) {
    const item: DocumentClient.PutItemInputAttributeMap = { [this.attributeName]: migrationName };

    if (this.timestamp) {
      item.createdAt = Date.now();
    }

    await this.documentClient.put({ TableName: this.tableName, Item: item }).promise();
  }

  /**
   * Unlogs migration to be considered as pending.
   *
   * @param migrationName - Name of the migration to be unlogged.
   */
  async unlogMigration(migrationName: string) {
    const key: DocumentClient.Key = { [this.attributeName]: migrationName };

    await this.documentClient.delete({ TableName: this.tableName, Key: key }).promise();
  }

  /**
   * Gets list of executed migrations.
   */
  async executed() {
    const executedItems: string[] = [];
    let startKey: DocumentClient.Key;

    do {
      const { Items, LastEvaluatedKey } = await this.documentClient.scan({
        TableName: this.tableName,
        ExclusiveStartKey: startKey,
      })
      .promise()
      .catch(error => {
        if (error.code === RESOURCE_NOT_FOUND_EXCEPTION) {
          return this.createMigrationTable()
            .then(() => ({
              Items: [],
              LastEvaluatedKey : null
            }));

        } else {
          throw error;
        }
      });

      for (const item of Items) {
        executedItems.push(item[this.attributeName]);
      }

      startKey = LastEvaluatedKey;
    } while (startKey);

    return sort((a, b) => a.localeCompare(b), executedItems);
  }

  /**
     * Create migration table.
     *
     * @returns Promise
     */
   createMigrationTable() {
    const params = {
      TableName: 'migrations',
      AttributeDefinitions: [
          { AttributeName: 'name', AttributeType: 'S' },
      ],
      KeySchema: [
          { AttributeName: 'name', KeyType: 'HASH' },
      ],
      ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
      }
    };
    return this.dynamodb.createTable(params).promise();
  }
}
