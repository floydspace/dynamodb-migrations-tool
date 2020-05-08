import { CommandModule } from 'yargs';

import { defaultMigrator } from '../core/migrator';
import { BaseCliOptions, baseOptions } from '../core/yargs';
import logger from '../helpers/logger';

interface CliOptions extends BaseCliOptions {
  to?: string | number;
}

export default {
  builder: yargs => baseOptions(yargs)
    .option('to', {
      describe: 'Revert to the provided migration',
      default: 0,
      type: 'string'
    }),

  handler: async (args) => {
    try {
      const migrations = await defaultMigrator.executed();

      if (migrations.length === 0) {
        logger.log('No executed migrations found.');

        process.exit(0);
      }

      await defaultMigrator.down({ to: args.to || 0 });
    } catch (e) {
      logger.error(e);
    }

    process.exit(0);
  }
} as CommandModule<CliOptions, CliOptions>;