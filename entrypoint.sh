#!/bin/bash
database=zoo
wait_time=15s
password=root

# wait for SQL Server to come up
echo importing data will start in $wait_time...
sleep $wait_time
echo importing data...

# run the init script to create the DB and the tables in /table
/opt/mssql-tools/bin/sqlcmd -S 0.0.0.0 -U sa -P $password -i ./init.sql
/opt/mssql-tools/bin/sqlcmd -S 0.0.0.0 -U sa -P $password -i ./Mytable.sql