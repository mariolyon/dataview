#!/bin/sh
docker run --name dataview-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=dataview \
  -p 5432:5432 \
  -d postgres
