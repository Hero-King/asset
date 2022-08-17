### Mysql 5.7.27离线安装

#### 下载资源

笔者推荐使用国内镜像站下载，官网下载速度有待提高啊

http://mirrors.sohu.com/ 

笔者下载的是 mysql-5.7.27-linux-glibc2.12-x86_64.tar.xz 

```
解压文件到 /usr/local/下
yum -y install libaio
ln -s mysql-5.7.27-linux-glibc2.12-x86_64/ mysql # 建立软连接
groupadd mysql && useradd -r -g mysql mysql 
chown -R mysql:mysql ./
./bin/mysqld --initialize --user=mysql  # 初始化mysql 
ln -s /usr/local/mysql/support-files/mysql.server /etc/init.d/mysqld
ln -s /usr/local/mysql/bin/mysql /usr/bin/
mkdir /var/log/mariadb/ && touch /var/log/mariadb/mariadb.log && chown mysql.mysql /var/log/mariadb/mariadb.log
如果出现找不到/tmp/mysql.sock   -》ln -s /var/lib/mysql/mysql.sock /tmp
ALTER USER 'root'@'localhost' IDENTIFIED BY '新密码';
update user set host='%' where user = 'root'; 	#开启root远程登录

```

