#! /bin/bash

#  debain版本
# chsh -s /bin/bash
# 切换默认的sh在执行这个脚本   dpkg-reconfigure dash 选择否

echo "export EDITOR=/usr/bin/vim" >> ~/.bashrc
echo "export PATH_INIT=${PATH}" >> /etc/profile

# 安装nodejs
node_url="https://mirrors.huaweicloud.com/nodejs/v12.19.1/node-v12.19.1-linux-arm64.tar.xz"
cd /usr/local/ && wget ${node_url}  && xz -d node-v12.19.1-linux-arm64.tar.xz && \
tar xvf node-v12.19.1-linux-arm64.tar &&  mv node-v12.19.1-linux-arm64 node-v12.19.1 && \
echo "export NODE_HOME=/usr/local/node-v12.19.1" >> /etc/profile && echo "export PATH=$PATH_INIT:$NODE_HOME/bin " >> /etc/profile && . /etc/profile


npm config set registry http://registry.npm.taobao.org/



# fix vim不能右键粘贴问题
echo "if has('mouse')" >> ~/.vimrc
echo "   set mouse-=a" >> ~/.vimrc
echo "endif" >> ~/.vimrc

apt-get remove nano

# 更改源
mv /etc/apt/sources.list /etc/apt/sources.list.bak
echo "deb http://mirrors.ustc.edu.cn/debian stretch main contrib non-free" >> /etc/apt/sources.list
echo "deb http://mirrors.ustc.edu.cn/debian stretch-updates main contrib non-free" >> /etc/apt/sources.list
echo "deb http://mirrors.ustc.edu.cn/debian stretch-backports main contrib non-free" >> /etc/apt/sources.list
echo "deb http://mirrors.ustc.edu.cn/debian-security/ stretch/updates main contrib non-free" >> /etc/apt/sources.list

apt-get update

apt-get install openssl

# 安装docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh --mirror Aliyun

mkdir -p /etc/docker
tee /etc/docker/daemon.json <<-'EOF'
{
"registry-mirrors": ["http://hub-mirror.c.163.com","https://registry.docker-cn.com"]
}
EOF
systemctl daemon-reload
systemctl restart docker

# 解决read-only问题   mount -o remount,rw /
# 或者用U盘启动，运行一次e2fsck /dev/mmcblk1p2  
# 文件监听限制: vim /etc/sysctl.conf   fs.inotify.max_user_watches = 524288
# chown root:root / -R

# 安装mysql
#docker pull mysql/mysql-server:8.0.22-1.1.18 && docker run -d --name=mysql1 -p 8080:8080 mysql/mysql-server:8.0.22-1.1.18 
# 查看密码:  docker logs mysql1 2>&1 | grep GENERATED     docker exec -it mysql1 mysql -uroot -p 链接mysql  改密码: ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';
# update user set host= "%" where user = "root";


# git 设置
# gitUrl="https://mirrors.edge.kernel.org/pub/software/scm/git/git-2.28.0.tar.gz"

# 生成秘钥
yes | ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa
ssh-copy-id  -i /root/.ssh/id_rsa.pub root@192.168.1.100

# 生成swap 2G
dd if=/dev/zero of=/swapfile1 bs=1024 count=2000000
mkswap /swapfile1
swapon /swapfile1
# 关闭  swapoff命令