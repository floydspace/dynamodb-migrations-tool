# dynamit-cli [![Build Status](https://travis-ci.org/floydspace/dynamodb-migrations-tool.svg?branch=master)](https://travis-ci.org/floydspace/dynamodb-migrations-tool) [![Coverage Status](https://coveralls.io/repos/github/floydspace/dynamodb-migrations-tool/badge.svg?branch=master)](https://coveralls.io/github/floydspace/dynamodb-migrations-tool?branch=master) [![npm version](https://badge.fury.io/js/dynamit-cli.svg)](https://badge.fury.io/js/dynamit-cli) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

The DynamoDB Migrations Tool Command Line Interface (CLI)

## Table of Contents
- [Installation](#installation)
- [Documentation](#documentation)

## Installation

Make sure you have [AWS-SDK](https://aws.amazon.com/sdk-for-node-js/) installed and configured properly. Then install the Dynamit CLI to be used in your project with

```bash
$ npm install --save-dev dynamit-cli
```

And then you should be able to run the CLI with

```bash
$ npx dynamit --help
```

Migration records are supposed to be stored in the DynamoDB table with the `table-name` (`"migrations"` by default) and primary key `attribute-name` (`"name"` by default) defined as optional cli options. The tool cannot create the table for you yet, so make sure you created it properly. See [Creating a Table Developer Guide](https://docs.amazonaws.cn/en_us/amazondynamodb/latest/developerguide/WorkingWithTables.Basics.html#WorkingWithTables.Basics.CreateTable)

### Usage

```
npx dynamit [command]

Commands:
  dynamit migrate                        Run pending migrations
  dynamit migrate:status                 List the status of all migrations
  dynamit migrate:undo                   Reverts a migration
  dynamit migrate:undo:all               Revert all migrations ran
  dynamit migration:generate             Generates a new migration file       [aliases: migration:create]

Options:
  --version                              Show version number                                         [boolean]
  --help                                 Show help                                                   [boolean]
  --migrations-path                      Specify folder with migrations, default 'migrations'        [string]
```

## Documentation

- [CLI Options](docs/README.md)
- [Frequently Asked Questions](docs/FAQ.md)
