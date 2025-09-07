# FTP

## 安装
yum -y install vsftpd  
关闭匿名访问

## 配置/etc/vsftp/vsftp.conf

- anonymous_enable 是否开启匿名登录
- local_enable=YES 允许使用远程主机上面的用户账号登录
- write_enable=YES 允许用户上传数据
- local_umask=022 上传的数据权限 umask
- chroot_local_user #是否将所有用户限制在主目录,YES 为启用 NO 禁用.(该项默认值是 NO,即在安装 vsftpd 后不做配置的话，ftp 用户是可以向上切换到要目录之外的)
- chroot_list_enable #是否启动限制用户的名单 YES 为启用 NO 禁用(包括注释掉也为禁用)
- chroot_list_file=/etc/vsftpd/chroot_list #是否限制在主目录下的用户名单，至于是限制名单还是排除名单，这取决于 chroot_local_user 的值
- connect_from_port_20=YES 主动模式，ftp 和 filezilla 都可以用主动方式连接前提是客户端或者 nat 没开防火墙拦截随机的客户端出去的端口
- guest_enable=YES 是否要把服务器的用户全部转成 ftp 用户的目录

## 常用命令

- ftp [host/IP] port 连接
- help 或者? 查看可用的命令
- dir ls 显示服务器目录下的文件
- type 查看当前使用什么方式传输文件
- get filename 【newfilename】下载单一文件,mget 下载多个文件可以使用通配符
- put finlename [newfilename] 上传文件 send 同样
- delete 删除文件
- passive 启动或者关闭 passive 模式
- lcd 切换客户端目录
- cd 改变远程工作目录
- rename 重命名
- ！用于执行客户端交互命令

## window 连接报错

200 Switching to ASCII mode.
550 Permission denied.

解决办法：设置 IE 浏览器>>Internet 选项>>高级>>将“使用被动 FTP（用于防火墙和 DSL 调制解调器的兼容）”选项去掉>>确定即可
