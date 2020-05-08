import clc from 'cli-color';
import path from 'path';
import { CommandModule } from 'yargs';

import { defaultMigrator } from '../core/migrator';
import { BaseCliOptions, baseOptions } from '../core/yargs';
import logger from '../helpers/logger';

interface CliOptions extends BaseCliOptions {
  name?: string;
}

export default {
  builder: yargs => baseOptions(yargs)
    .option('name', {
      describe: 'Defines the name of the migration',
      string: true,
      demandOption: true
    }),

  handler: async (args) => {
    await defaultMigrator.generate(args.name);

    logger.log(
      'New migration was created at',
      clc.blueBright(path.resolve(process.cwd(), 'migrations', args.name)),
      '.'
    );

    process.exit(0);
  }
} as CommandModule<CliOptions, CliOptions>;
