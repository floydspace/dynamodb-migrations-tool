import { Argv } from 'yargs';

export interface BaseCliOptions {
  'options-path': string;
  'migrations-path': string;
  'access-key-id': string;
  'secret-access-key': string;
  'region': string;
  'endpoint-url': string;
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
      describe: 'The DynamoDB endpoint url to use',
      type: 'string'
    });
}
