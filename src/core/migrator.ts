import DynamoDB, { DocumentClient } from 'aws-sdk/clients/dynamodb';
import nodePlop from 'node-plop';
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
  endpoint?: string;
  dynamodb?: DynamoDB;
  docclient?: DocumentClient;
  tableName?: string;
  attributeName?: string;
  migrationsPath?: string;
}

interface Generator {
  generate(migrationName: string): Promise<void>;
}

export class Migrator extends Umzug implements Generator {
  private generator;
  private migrationsPath: string;

  /**
   * Migrator factory function, creates an umzug instance with dynamodb storage.
   * @param options
   * @param options.region - an AWS Region
   * @param options.dynamodb - a DynamoDB client instance
   * @param options.docclient - a DynamoDB document client instance
   * @param options.endpoint - an optional endpoint URL for local DynamoDB instances
   * @param options.tableName - a name of migration table in DynamoDB
   * @param options.attributeName - name of the table primaryKey attribute in DynamoDB
   */
  constructor(options: MigratorOptions = {}) {
    let { dynamodb, docclient, tableName, attributeName, migrationsPath } = options;

    docclient = docclient || new DocumentClient(pick(['region', 'accessKeyId', 'secretAccessKey', 'endpoint'], options));
    dynamodb = dynamodb || new DynamoDB(pick(['region', 'accessKeyId', 'secretAccessKey', 'endpoint'], options));
    tableName = tableName || 'migrations';
    attributeName = attributeName || 'name';
    migrationsPath = migrationsPath || 'migrations';

    super({
      storage: new DynamoDBStorage({ dynamodb: docclient, tableName, attributeName }),
      migrations: {
        params: [docclient, dynamodb],
        path: migrationsPath,
      },
      logging: logger.log
    });

    const plop = nodePlop(path.join(__dirname, '../../.plop/plopfile.js'));
    this.generator = plop.getGenerator('migration');
    this.migrationsPath = migrationsPath;
  }

  async generate(migrationName: string) {
    await this.generator.runActions({
      migrationsPath: this.migrationsPath,
      timestamp: getCurrentYYYYMMDDHHmms(),
      name: migrationName
    });
  }
}

/**
 * Migrator instance with options by default.
 */
export const defaultMigrator: Migrator = new Migrator();
