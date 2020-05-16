import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Storage } from 'umzug';

interface DynamoDBStorageOptions {
  dynamodb?: DocumentClient;
  tableName?: string;
  attributeName?: string;
  timestamp?: boolean;
}

/**
 * @class DynamoDBStorage
 */
export default class DynamoDBStorage implements Storage {
  private dynamodb: DocumentClient;
  private tableName: string;
  private attributeName: string;
  private timestamp: boolean;

  /**
   * Constructs DynamoDB table storage.
   *
   * @param options
   * @param options.dynamodb - a DynamoDB document client instance
   * @param options.tableName - name of migration table in DynamoDB
   * @param options.attributeName - name of the table primaryKey attribute in DynamoDB
   * @param options.timestamp - option to add timestamps to the DynamoDB table
   */
  constructor({ dynamodb, tableName, attributeName, timestamp }: DynamoDBStorageOptions = {}) {
    if (dynamodb && !(dynamodb instanceof DocumentClient)) {
      throw new Error('"dynamodb" must be a DocumentClient instance');
    }
    this.dynamodb = dynamodb || new DocumentClient();
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

    await this.dynamodb.put({ TableName: this.tableName, Item: item }).promise();
  }

  /**
   * Unlogs migration to be considered as pending.
   *
   * @param migrationName - Name of the migration to be unlogged.
   */
  async unlogMigration(migrationName: string) {
    const key: DocumentClient.Key = { [this.attributeName]: migrationName };

    await this.dynamodb.delete({ TableName: this.tableName, Key: key }).promise();
  }

  /**
   * Gets list of executed migrations.
   */
  async executed() {
    const executedItems: string[] = [];
    let startKey: DocumentClient.Key;

    do {
      const { Items, LastEvaluatedKey } = await this.dynamodb.scan({
        TableName: this.tableName,
        ExclusiveStartKey: startKey,
      }).promise();

      for (const item of Items) {
        executedItems.push(item[this.attributeName]);
      }

      startKey = LastEvaluatedKey;
    } while (startKey);

    return executedItems;
  }
}
