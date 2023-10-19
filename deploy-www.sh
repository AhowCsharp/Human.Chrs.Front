#!/bin/bash
host=ahow.tw
path=/x/srv/dorey_chrs
npm run build
cd build
tar -zcvf ../www.tar.gz *
cd ..
scp www.tar.gz $host:$path
ssh $host tar zxvf $path/www.tar.gz -C $path/html