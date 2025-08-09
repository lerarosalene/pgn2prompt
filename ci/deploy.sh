#!/usr/bin/env bash

set -ex

if [ -z "${NETLIFY_TOKEN}" ]; then
  echo "Pass NETLIFY_TOKEN as environment variable. Aborting."
  exit 1
fi

if [ -z "${NETLIFY_SITE_ID}" ]; then
  echo "Pass NETLIFY_SITE_ID as environment variable. Aborting."
  exit 1
fi

DIST_NAME="dist.zip"

npm ci
npm run tsc
npm run build

if [ -f "${DIST_NAME}" ]; then
  rm "${DIST_NAME}"
fi

pushd dist
  zip -r0 "../${DIST_NAME}" .
popd

ls -alh "${DIST_NAME}"

curl \
  -H"Content-Type: application/zip" \
  -H"Authorization: Bearer $NETLIFY_TOKEN" \
  -XPOST \
  --data-binary "@${DIST_NAME}" \
  "https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/deploys"
