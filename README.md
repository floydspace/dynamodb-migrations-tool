# dynamodb-migrations-tool [![Build Status](https://travis-ci.org/floydspace/dynamodb-migrations-tool.svg?branch=master)](https://travis-ci.org/floydspace/dynamodb-migrations-tool) [![Coverage Status](https://coveralls.io/repos/github/floydspace/dynamodb-migrations-tool/badge.svg?branch=master)](https://coveralls.io/github/floydspace/dynamodb-migrations-tool?branch=master) [![npm version](https://badge.fury.io/js/%40floydspace%2Fdynamodb-migrations-tool.svg)](https://badge.fury.io/js/%40floydspace%2Fdynamodb-migrations-tool) [![npm](https://img.shields.io/npm/dt/dynamodb-migrations-tool)](https://www.npmjs.com/package/dynamodb-migrations-tool)


The *dynamodb-migrations-tool* is a DynamoDB storage based migrator implemented on top of the relyable and well tested framework agnostic migration tool **[umzug](https://github.com/sequelize/umzug)**.

## Installation

```sh
npm install dynamodb-migrations-tool --save
```

## Usage

The following example demonstrate a minimal usage of the migrator:

```javascript
const {defaultMigrator} = require('dynamodb-migrations-tool');

(async () => {
  // checks migrations and run them if they are not already applied
  await defaultMigrator.up();
  console.log('All migrations performed successfully');
})();
```
Using example bellow you can create a migrator instance with a couple `migratorOptions`:
```javascript
const {migratorFactory} = require('dynamodb-migrations-tool');

const migrator = migratorFactory({
  migrationTable: 'migrations' // default
});

(async () => {
  await migrator.up();
})();
```

### Migrator Options

The possible `migratorOptions` are:

```js
{
  // The configured DynamoDB DocumentClient instance from aws-sdk.
  // Optional. If omited it will be created with default aws-sdk config.
  dynamodb: DynamoDB.DocumentClient,

  // Custom DynamoDB migration table name, can be populated with stage and stuff.
  // Optional. Default value is `migrations`.
  migrationTable: String,
}
```
