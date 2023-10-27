#!/bin/bash

yarn remove @subsocial/data-hub-sdk

yarn add @subsocial/data-hub-sdk@dappforce/subsocial-data-hub-sdk#staging

cd node_modules/@subsocial/data-hub-sdk

package_folder="./"

find "./" -mindepth 1 -maxdepth 1 ! -name 'dist' -exec rm -r {} \;

cp -r "$package_folder/dist/." "$package_folder"

rm -r "$package_folder/dist"