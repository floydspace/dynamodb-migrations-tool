const path = require('path');

module.exports = function (plop) {
  plop.setGenerator('migration', {
    actions: () => [{
      type: 'add',
      path: path.resolve(process.cwd(), './migrations/{{timestamp}}-{{name}}.js'),
      templateFile: path.join(__dirname, './migration.js.hbs'),
    }],
  });
};
