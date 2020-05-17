import { pick } from 'ramda';
import { Arguments, Argv } from 'yargs';

import { Migrator } from './migrator';

export interface BaseCliOptions {
  optionsPath: string;
  migrationsPath: string;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  endpointUrl: string;
  tableName: string;
  attributeName: string;
}

export function baseOptions(yargs: Argv<BaseCliOptions>) {
  return yargs
    .option('options-path', {
      describe: 'The path to a JSON file with additional options',
      type: 'string'
    })
    .option('migrations-path', {
      describe: 'The path to the migrations folder',
      default: 'migrations',
      type: 'string'
    })
    .option('access-key-id', {
      describe: 'AWS access key id',
      type: 'string'
    })
    .option('secret-access-key', {
      describe: 'AWS secret access key',
      type: 'string'
    })
    .option('region', {
      describe: 'AWS service region',
      type: 'string'
    })
    .option('endpoint-url', {
      describe: 'The DynamoDB endpoint url to use. The DynamoDB local instance url could be specified here.',
      type: 'string'
    })
    .option('table-name', {
      describe: 'The DynamoDB table name',
      default: 'migrations',
      type: 'string'
    })
    .option('attribute-name', {
      describe: 'The DynamoDB primaryKey attribute name',
      default: 'name',
      type: 'string'
    });
}

export function baseHandler<T extends BaseCliOptions>(callback: (args: Arguments<T>, migrator: Migrator) => void) {
  return (args: Arguments<T>): void => {
    const migrator = new Migrator({
      ...pick(['region', 'accessKeyId', 'secretAccessKey'], args),
      tableName: args.tableName,
      attributeName: args.attributeName,
    });

    callback(args, migrator);
  };
}
