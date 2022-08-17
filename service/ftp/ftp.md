## 安装
yum -y install vsftpd   
关闭匿名访问

## 配置/etc/vsftp/vsftp.conf
- anonymous_enable是否开启匿名登录
- local_enable=YES允许使用远程主机上面的用户账号登录
- write_enable=YES 允许用户上传数据
- local_umask=022上传的数据权限umask
- chroot_local_user #是否将所有用户限制在主目录,YES为启用 NO禁用.(该项默认值是NO,即在安装vsftpd后不做配置的话，ftp用户是可以向上切换到要目录之外的)
- chroot_list_enable #是否启动限制用户的名单 YES为启用 NO禁用(包括注释掉也为禁用)
- chroot_list_file=/etc/vsftpd/chroot_list #是否限制在主目录下的用户名单，至于是限制名单还是排除名单，这取决于chroot_local_user的值
- connect_from_port_20=YES 主动模式，ftp和filezilla都可以用主动方式连接前提是客户端或者nat没开防火墙拦截随机的客户端出去的端口
- guest_enable=YES 是否要把服务器的用户全部转成ftp用户的目录


## 常用命令
- ftp [host/IP] port 连接
- help 或者? 查看可用的命令
- dir ls 显示服务器目录下的文件
- type 查看当前使用什么方式传输文件
- get filename 【newfilename】下载单一文件,mget下载多个文件可以使用通配符
- put finlename [newfilename] 上传文件 send同样
- delete删除文件
- passive启动或者关闭passive模式
- lcd 切换客户端目录
- cd 改变远程工作目录
- rename重命名
- ！用于执行客户端交互命令


## window连接报错
200 Switching to ASCII mode.
550  Permission denied.

解决办法：设置IE浏览器>>Internet选项>>高级>>将“使用被动FTP（用于防火墙和DSL调制解调器的兼容）”选项去掉>>确定即可