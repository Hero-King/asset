#! /bin/bash
# 安装阿里云webdav 和 和彩云webdav

mkdir -p /root/docker/caiyun
cd /root/docker/caiyun 

echo "pwd: `pwd`"

cat > docker-compose.yml <<EOF
version: '3'
services:
  caiyun-webdav:
    image: vgearen/caiyun-webdav
    container_name: caiyun-webdav
    restart: unless-stopped
    volumes:
      - /etc/localtime:/etc/localtime
    ports:
      - "9000:8080"
    tty: true
    environment:
      - TZ=Asia/Shanghai
      - CAIYUN_ACCOUNT=
      - CAIYUN_TOKEN=
      - CAIYUN_ENCRYPT=
      - CAIYUN_TEL=
      - CAIYUN_AUTH_USER_NAME=<change me>
      - CAIYUN_AUTH_PASSWORD=<change me>
EOF


echo "complete!! 请前往路径编辑配置"

# pip install aliyundrive-webdav
# aliyundrive-webdav -p 9001 --host 127.0.0.1 --refresh-token refreshtoken -U admin -W admin

wget https://github.com/messense/aliyundrive-webdav/releases/download/v1.3.1/aliyundrive-webdav_1.3.1_arm64.deb
dpkg -i aliyundrive-webdav_1.3.1_arm64.deb

# 配置文件
cat /etc/systemd/system/aliyundrive-webdav.service

# 如果需要放在nginx 之后, 需要删除掉 --auto-index