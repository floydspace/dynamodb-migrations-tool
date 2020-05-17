import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import nodePlop from 'node-plop/lib/node-plop';
import path from 'path';
import { pick } from 'ramda';
import Umzug from 'umzug';

import logger from '../helpers/logger';
import { getCurrentYYYYMMDDHHmms } from '../helpers/path';
import DynamoDBStorage from '../storages/dynamodb';

export {DynamoDBStorage};

export interface MigratorOptions {
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  dynamodb?: DocumentClient;
  tableName?: string;
  attributeName?: string;
}

export class Migrator {
  private umzug: Umzug.Umzug;
  private generator;

  /**
   * Migrator factory function, creates an umzug instance with dynamodb storage.
   * @param options
   * @param options.region - an AWS Region
   * @param options.dynamodb - a DynamoDB document client instance
   * @param options.tableName - a name of migration table in DynamoDB
   * @param options.attributeName - name of the table primaryKey attribute in DynamoDB
   */
  constructor(options: MigratorOptions = {}) {
    let { dynamodb, tableName, attributeName } = options;

    dynamodb = dynamodb || new DocumentClient(pick(['region', 'accessKeyId', 'secretAccessKey'], options));
    tableName = tableName || 'migrations';
    attributeName = attributeName || 'name';

    this.umzug = new Umzug({
      storage: new DynamoDBStorage({ dynamodb, tableName, attributeName }),
      migrations: {
        params: [dynamodb],
      },
      logging: logger.log
    });

    const plop = nodePlop(path.join(__dirname, '../../.plop/plopfile.js'));
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