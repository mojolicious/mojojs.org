#!/usr/bin/env bash
DEV=../mojo.js
PROD=./mojo.js-main
if [ -d "$DEV" ]; then
  echo "Generating reference documentation for $DEV (dev)."
  npx typedoc $DEV/src/*.ts $DEV/src/**/*.ts --tsconfig $DEV/tsconfig.json --out public/reference
elif [ -d "$PROD" ]; then
  echo "Generating reference documentation for $PROD (production)."
  npx typedoc $PROD/src/*.ts $PROD/src/**/*.ts --tsconfig $PROD/tsconfig.json --out public/reference
else 
  echo "No mojo.js sources found."
fi
