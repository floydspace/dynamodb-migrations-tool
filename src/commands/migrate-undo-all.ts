import { CommandModule } from 'yargs';

import { BaseCliOptions, baseHandler, baseOptions } from '../core/yargs';
import logger from '../helpers/logger';

interface CliOptions extends BaseCliOptions {
  to: string | 0;
}

export default {
  builder: yargs => baseOptions(yargs)
    .option('to', {
      describe: 'Revert to the provided migration',
      default: 0,
      type: 'string'
    }),

  handler: baseHandler(async (args, migrator) => {
    try {
      const migrations = await migrator.executed();

      if (migrations.length === 0) {
        logger.log('No executed migrations found.');

        process.exit(0);
      }

      await migrator.down({ to: args.to || 0 });
    } catch (e) {
      logger.error(e);
    }

    process.exit(0);
  })
} as CommandModule<CliOptions, CliOptions>;
