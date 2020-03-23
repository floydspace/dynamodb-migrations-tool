import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import * as Umzug from 'umzug';

import DynamoDBStorage from './storages/dynamodb';

export {DynamoDBStorage};

export interface Migrator extends Umzug.Umzug {}

export interface MigratorOptions {
  dynamodb?: DocumentClient;
  tableName?: string;
}

/**
 * Migrator factory function, creates an umzug instance with dynamodb storage.
 * @param options
 * @param options.dynamodb - a DynamoDB document client instance
 * @param options.tableName - a name of migration table in DynamoDB
 */
export function migratorFactory({ dynamodb, tableName }: MigratorOptions = {}): Migrator {
  dynamodb = dynamodb || new DocumentClient();
  tableName = tableName || 'migrations';

  return new Umzug({
    storage: new DynamoDBStorage({ dynamodb, tableName }),
    migrations: {
      params: [dynamodb],
    },
    logging: function (...args: unknown[]) {
      console.log.apply(null, args);
    }
  });
}

/**
 * Migrator instance with options by default.
 */
export const defaultMigrator: Migrator = migratorFactory();
