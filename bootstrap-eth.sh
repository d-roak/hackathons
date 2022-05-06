#!/bin/bash

cp -r base-eth $(date +%Y)-$1
sed -i 's/"base"/\L"'$1'"/g' $(date +%Y)-$1/package.json