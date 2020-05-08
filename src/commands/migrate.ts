import { CommandModule } from 'yargs';

import { defaultMigrator } from '../core/migrator';
import { BaseCliOptions, baseOptions } from '../core/yargs';
import logger from '../helpers/logger';

interface CliOptions extends BaseCliOptions {
  to?: string;
  from?: string;
}

export default {
  builder: yargs => baseOptions(yargs)
    .option('to', {
      describe: 'Migration name to run migrations until',
      type: 'string'
    })
    .option('from', {
      describe: 'Migration name to start migrations from (excluding)',
      type: 'string'
    }),

  handler: async function (args) {
    const command = args._[0];

    switch (command) {
      case 'migrate':
        await migrate(args);
        break;
      case 'migrate:status':
        await migrationStatus();
        break;
    }

    process.exit(0);
  }
} as CommandModule<CliOptions, CliOptions>;

async function migrate(args: CliOptions) {
  try {
    const migrations = await defaultMigrator.pending();
    const options: Partial<CliOptions> = {};

    if (migrations.length === 0) {
      logger.log('No migrations were executed, database schema was already up to date.');
      process.exit(0);
    }
    if (args.to) {
      if (migrations.filter(migration => migration.file === args.to).length === 0) {
        logger.log('No migrations were executed, database schema was already up to date.');
        process.exit(0);
      }
      options.to = args.to;
    }
    if (args.from) {
      if (migrations.map(migration => migration.file).lastIndexOf(args.from) === -1) {
        logger.log('No migrations were executed, database schema was already up to date.');
        process.exit(0);
      }
      options.from = args.from;
    }

    await defaultMigrator.up(options);
  } catch (e) {
    logger.error(e);
  }
}

async function migrationStatus() {
  try {
    const executedMigrations = await defaultMigrator.executed();

    executedMigrations.forEach(migration => {
      logger.log('up', migration.file);
    });

    const pendingMigrations = await defaultMigrator.pending();

    pendingMigrations.forEach(migration => {
      logger.log('down', migration.file);
    });
  } catch (e) {
    logger.error(e);
  }
}
