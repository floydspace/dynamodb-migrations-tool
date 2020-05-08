import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import nodePlop from 'node-plop/lib/node-plop';
import Umzug from 'umzug';

import logger from '../helpers/logger';
import { getCurrentYYYYMMDDHHmms } from '../helpers/path';
import DynamoDBStorage from '../storages/dynamodb';

export {DynamoDBStorage};

export interface MigratorOptions {
  dynamodb?: DocumentClient;
  tableName?: string;
}

export class Migrator {
  private umzug: Umzug.Umzug;
  private generator;

  /**
   * Migrator factory function, creates an umzug instance with dynamodb storage.
   * @param options
   * @param options.dynamodb - a DynamoDB document client instance
   * @param options.tableName - a name of migration table in DynamoDB
   */
  constructor({ dynamodb, tableName }: MigratorOptions = {}) {
    dynamodb = dynamodb || new DocumentClient();
    tableName = tableName || 'migrations';

    this.umzug = new Umzug({
      storage: new DynamoDBStorage({ dynamodb, tableName }),
      migrations: {
        params: [dynamodb],
      },
      logging: logger.log
    });

    const plop = nodePlop('.plop/plopfile.js');
    this.generator = plop.getGenerator('migration');
  }

  async generate(migrationName: string) {
    await this.generator.runActions({timestamp: getCurrentYYYYMMDDHHmms(), name: migrationName});
  }

  execute(options?: Umzug.ExecuteOptions) {
    return this.umzug.execute(options);
  }

  pending() {
    return this.umzug.pending();
  }

  executed() {
    return this.umzug.executed();
  }

  up(options?) {
    return this.umzug.up(options);
  }

  down(options?) {
    return this.umzug.down(options);
  }
}

/**
 * Migrator instance with options by default.
 */
export const defaultMigrator: Migrator = new Migrator();
