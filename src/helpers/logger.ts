import clc from 'cli-color';

export default {
  log(...args: unknown[]) {
    console.log.apply(this, args);
  },

  error(error: Error | string) {
    let message = error;

    if (error instanceof Error) {
      message = error.message;
    }

    this.log();
    console.error(`${clc.red('ERROR:')} ${message}`);
    this.log();

    process.exit(1);
  },
};
