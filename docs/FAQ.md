The DynamoDB Migrations Tool Command Line Interface (CLI) Frequently Asked Question

## How can I create a migration?
Specify migration name with `--name` argument
```
$ dynamit migration:create --name <migration_name>
```

## What is the command to execute all migrations?
```
$ dynamit migrate
```
## How can I make a migrations rollback?
```
$ dynamit migrate:undo:all
```
