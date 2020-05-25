## Options

The manuals will show all the flags and options which are available for the respective tasks.
If you find yourself in a situation where you always define certain flags in order to
make the CLI compliant to your project, you can move those definitions also into a file called
`.dynamitrc`. The file will get `require`d if available and can therefore be either a JSON file, YAML
or a Node.JS script that exports a hash.

### Example for a Node.JS script

```js
var path = require('path')

module.exports = {
  migrationsPath: 'db/migrate'
}
```

This will configure the CLI to always treat `db/migrate` as the directory for migrations.

### The migration schema

The CLI uses [umzug](https://github.com/sequelize/umzug) and its migration schema. This means a migration has to look like this:

```js
module.exports = {
  up: function(dynamodb, done) {
    done();
  },

  down: function(dynamodb) {
    return new Promise(function (resolve, reject) {
      resolve();
    });
  }
};
```

Please note that you can either return a Promise or call the third argument of the function once your asynchronous logic was executed. If you pass something to the callback function (the `done` function) it will be treated as erroneous execution.
