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
      describe: 'Name of the migration to undo',
      type: 'string'
    }),

  handler: async (args) => {
    try {
      const migrations = await defaultMigrator.executed();

      if (migrations.length === 0) {
        logger.log('No executed migrations found.');

        process.exit(0);
      }

      if (args.name) {
        await defaultMigrator.down(args.name);
      } else {
        await defaultMigrator.down();
      }
    } catch (e) {
      logger.error(e);
    }

    process.exit(0);
  }
} as CommandModule<CliOptions, CliOptions>;
