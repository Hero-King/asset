#! /bin/bash
read -p '请输入管理员用户名: ' user
read -p "请输入管理员${user}密码: " passwd
cd /opt
mkdir mongodb
cd ./mongodb
mkdir data
mkdir backup
echo ${user} ${passwd}
echo "删除之前mongo"
docker stop mongo
docker rm mongo
docker run --name mongo -p 27017:27017   -v /opt/mongodb/data:/data/db -v /mnt/mongodb/backup:/data/backup -e MONGO_INITDB_ROOT_USERNAME=${user} -e MONGO_INITDB_ROOT_PASSWORD=${passwd}   -d mongo --auth
echo "请注意防火墙打开端口27017,设置库密码"


