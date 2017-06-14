#!/bin/bash
set -e

BRANCH=${TRAVIS_BRANCH:-$(git rev-parse --abbrev-ref HEAD)}

if [[ $BRANCH == 'master' ]]; then
  STAGE="prod"
elif [[ $BRANCH == 'develop' ]]; then
  STAGE="dev"
fi

if [ -z ${STAGE+x} ]; then
  echo "Not deploying changes";
  exit 0;
fi

echo "Deploying from branch [$BRANCH] to stage [$STAGE]"

# cp "./config/$STAGE.json" config.json

# npm prune --production

SLS_DEBUG=* sls deploy -v --stage $STAGE
