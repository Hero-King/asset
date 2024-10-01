# PVE

## 安装

华硕安装 8.0.2 系统卡死在 loading driver, 使用 7.4 安装成功
安装成功后访问 8006 端口管理

使用 pve_source 优化 PVE 配置
wget -q -O /root/pve_source.tar.gz 'https://bbs.x86pi.cn/file/topic/2023-11-28/file/01ac88d7d2b840cb88c15cb5e19d4305b2.gz' && tar zxvf

替换 LX 模板仓库地址(pve_source 脚本中可替换)
cp /usr/share/perl5/PVE/APLInfo.pm /usr/share/perl5/PVE/APLInfo.pm_back
sed -i 's|http://download.proxmox.com|https://mirrors.tuna.tsinghua.edu.cn/proxmox|g' /usr/share/perl5/PVE/APLInfo.pm

- 安装后处理源问题 参考 https://wph.im/245.html
- 分区合并到同一个 参考 https://zhuanlan.zhihu.com/p/605741611
- 安装无线网卡驱动 (已不支持 kernel5.15)
- 设置断电(ping不通路由器)自动关机 <a href="https://www.bilibili.com/read/cv34783885/">ping.sh</a> 

## 快照

想要使用快照功能, 需要虚拟机的硬盘是 qcow2 格式, raw 格式不支持快照, 需要使用 pve 的 qemu-img 命令转换

## 设备直通

## USB

USB 直通有两种方式,一种是绑定插入的 USB 设备 ID,另一种是绑定 USB 端口,
如果是 USB3.0,需要绑定两个端口,才能兼容 3.0 设备和 2.0 设备

## 群晖

### 安装

跟安装 openwrt 一样的步骤，只不过磁盘需要使用 sata 格式， 删除磁盘导入 github 下载的 arpl 选择 model: 918, build Number: 42962, gender SerialNum => build loader, 等待一分钟访问 ip:5000 即可， 上传 pat 文件需要到跳转到群晖官网下载, 选择最新的操作系统版本，然后点击“所有下载”， 找到对应的 buildNumber 目录中>300Mb 的系统镜像

> 安装矿神源

### ddns

连接性中 ddns 新增自定义供应商 Query URL：https://ddns.bkood.com/dns/quick/ali/default?ip=__MYIP__&hostname=__HOSTNAME__&ak=__USERNAME__&sk=__PASSWORD__

### ssl

安全性菜单证书中, 使用阿里签发的免费的 ssl 证书替换默认证书

### nginx 功能

登陆门户中 高级配置 nginx

```
描述	来源	目的地	备注
qbittorrent	https://qb.heroking.top:8000	http://localhost:8089	
op-web	https://op.heroking.top:8000	htttps://192.168.2.1:8000	
k2p-web	https://k2p.heroking.top:8000	https://192.168.2.10	
pve-web	https://pve.heroking.top:8000	https://192.168.2.2:8006	
18000端口转发到op	https://*:18000	https://192.168.2.1:8000	外网将18000映射到op的8000；内网也做一下映射
```

### 磁盘扩容

https://blog.csdn.net/m0_37680500/article/details/132698025

## 资源管理

pve 使用的 noVnc 作为系统界面
资产网关 Apache Guacamole


## 小雅

http://nas.heroking.top:5678/tvbox/my.json
http://nas.heroking.top:5678/tvbox/juhe.json
webdav: http://nas.heroking.top:5678 用户名dav
