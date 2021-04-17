#!/usr/bin/env bash
echo "Publishing apollo-server-fastify@$1"

nx build apollo-server-fastify
cd dist/apollo-server-fastify

if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i "" "s|0.0.1|$1|g" package.json
else
    sed -i "s|0.0.1|$1|g" package.json
fi

npm adduser
npm publish --access public --tag latest

