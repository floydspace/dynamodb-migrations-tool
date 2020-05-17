import { CommandModule } from 'yargs';

import { BaseCliOptions, baseHandler, baseOptions } from '../core/yargs';
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

  handler: baseHandler(async (args, migrator) => {
    try {
      const migrations = await migrator.executed();

      if (migrations.length === 0) {
        logger.log('No executed migrations found.');

        process.exit(0);
      }

      if (args.name) {
        await migrator.down(args.name);
      } else {
        await migrator.down();
      }
    } catch (e) {
      logger.error(e);
    }

    process.exit(0);
  })
} as CommandModule<CliOptions, CliOptions>;
