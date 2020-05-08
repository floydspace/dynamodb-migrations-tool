# dynamit-cli [![Build Status](https://travis-ci.org/floydspace/dynamodb-migrations-tool.svg?branch=master)](https://travis-ci.org/floydspace/dynamodb-migrations-tool) [![Coverage Status](https://coveralls.io/repos/github/floydspace/dynamodb-migrations-tool/badge.svg?branch=master)](https://coveralls.io/github/floydspace/dynamodb-migrations-tool?branch=master) [![npm version](https://badge.fury.io/js/dynamit-cli.svg)](https://badge.fury.io/js/dynamit-cli)

The DynamoDB Migrations Tool Command Line Interface (CLI)

## Table of Contents
- [Installation](#installation)
- [Documentation](#documentation)

## Installation

Make sure you have [AWS-SDK](https://aws.amazon.com/sdk-for-node-js/) installed. Then install the Dynamit CLI to be used in your project with

```bash
$ npm install --save-dev dynamit-cli
```

And then you should be able to run the CLI with

```bash
$ npx dynamit --help
```

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
  --version  Show version number                                         [boolean]
  --help     Show help                                                   [boolean]
```

## Documentation

- [CLI Options](docs/README.md)
- [Frequently Asked Questions](docs/FAQ.md)
