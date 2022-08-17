```
本地、远程同步文件 rsync (完整的复制所有的权限   属性等数据)
生成iso文件 mkisofs
查看iso文件信息 isoinfo
光盘烧录工具 wodim
备份 dd  （将镜像写入到usb）默认dd 是一个一个扇区去读/写的，而且即使没有用到的扇区也会倍写入备份文件中！ 因此这个文件会变得跟原本的磁盘一模一样大
vim : dd删除光标行 ndd向下删除n行 yy复制行  u撤回操作  ctrl+r还原撤回 P/p (上一行/下一行)粘贴
sshfs 远程挂载
lsblk列出存储设备 -f(文件系统)
blkid 列出硬件uuid
gdisk/fdisk分区 (gdisk创建gpt分区表,fdisk -l查看分区信息,创建mbr分区表,创建完成需要格式化,创建文件系统 xfs? ext4)
partprobe [-s]更新linux内核分区表信息
mkfs 格式化文件系统 mkfs.ext4
mount 分区即可 如果乱码使用 iocharset指定编码
fsck/xfs_repair 文件系统恢复  fsck.ext4
命令 & 将进程放入bash后台执行
jobs 查看bash后台  bg fg 命令
nohub 可以脱机执行  可以 nohub *** &  
systemctl get-default/set-default/list-units(显示目前启动的units)/list-unit-files(显示/usr/lib/systemd/system里面的units)/list-dependencies[--reverse](显示依赖的服务或者被某服务依赖)  --type=??
/var/log/messages 系统重要日志,崩溃或者添加设备等都可以查看这里的日志
shsh 更改shell
last  查看登录历史
lastb 登录失败信息
logrotate 日志轮回
umask 文件默认权限 是减去哪些权限
chattr 文件/目录隐藏属性 chattr [+-=] 参数 文件/目录 参数a 只能增加文件内容 参数i 保护文件(不能删 改名 link 写入 新增)
lsattr 查看文隐藏属性
LVM 硬盘分区后格式化文件系统可以使用LVM Logical Volume Manager(逻辑卷管理) 将一个或多个硬盘的分区在逻辑上集合，相当于一个大硬盘来使用，当硬盘的空间不够使用的时候，可以继续将其它的硬盘的分区加入其中，这样可以实现磁盘空间的动态管理，相对于普通的磁盘分区有很大的灵活性。也可以在一个分区上装多个文件系统
VFS virtual filesystem Switch 内核提供的功能,针对不同文件系统提供统一的读写接口
之前linux使用ext4 centos7后 默认使用xfs文件系统

远程唤醒: WOL PCIE唤醒   yum install ethtool   ethtool -s [网卡名] wol g 是的系统支持远程唤醒;


```