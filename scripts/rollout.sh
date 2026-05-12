#!/bin/sh

ROOT=$(git rev-parse --show-toplevel)
SCRIPTS=${ROOT}/scripts
${SCRIPTS}/build.sh && ${SCRIPTS}/push.sh && ${SCRIPTS}/deploy.sh
