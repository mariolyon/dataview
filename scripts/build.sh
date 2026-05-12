#!/usr/bin/env sh
echo "#BUILD"
set -euo pipefail

ROOT=$(git rev-parse --show-toplevel)
docker build -t ghcr.io/mariolyon/dataview:latest -f ${ROOT}/Dockerfile ${ROOT}
