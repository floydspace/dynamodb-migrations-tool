import path from 'path';

const packageJson = require(path.resolve(__dirname, '..', '..', 'package.json')); // eslint-disable-line @typescript-eslint/no-var-requires

export default {
  getCliVersion() {
    return packageJson.version;
  },

  getNodeVersion() {
    return process.version.replace('v', '');
  },
};
