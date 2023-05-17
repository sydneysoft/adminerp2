#!/bin/bash
# -*- ENCODING: UTF-8 -*-

# bash */copy-repository.sh name_dir repository port token secret

name_dir=$1
repository=$2
port=$3
token=$4
secret=$5

cd ~/customer

git clone $repository "$name_dir" # ~/

cd $name_dir

npm install

# Modify .env file

cp ecosystem.config.js.example ecosystem.config.js
# cp .env.example .env
sed -i 's/%name%/'$name_dir'/g' ecosystem.config.js
sed -i 's/%path%/'$PWD'/g' ecosystem.config.js
sed -i 's/%port%/'$port'/g' ecosystem.config.js
sed -i 's/%secret%/'$secret'/g' ecosystem.config.js
sed -i 's/%token%/'$token'/g' ecosystem.config.js
sed -i 's/%path%/./g' ecosystem.config.js # replace path

# start pm2 process
pm2 start ~/customer/$1/ecosystem.config.js
pm2 save


exit
