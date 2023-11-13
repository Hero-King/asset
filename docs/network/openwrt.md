# 路由器

## openwrt 系统

下载老朱推荐: https://www.right.com.cn/forum/thread-8293351-1-1.html
目前使用 openwrt6.1-jpxb-20231028-x86-64-generic-squashfs-combined-efi.img https://www.right.com.cn/forum/thread-8286335-1-1.html

按照品牌搜索下载对应的 sysupdate.bin 包
安装 `qm importdisk 100 /var/lib/vz/template/iso/xx.img local`
vi /etc/config/network

- 系统-启动项-appfilter 关闭自启动

## 插件

- 首页改用 nginx
- 去掉科学上网;广告屏蔽;dns 过滤;
- 网络存储都要 aria2 nfs ftp Samba4 Transmission
- vpn 都要 v2ray; openvpn; IPSec VPN; PPTP VPN 服务器
- 阿里云盘 FUSE
- 阿里云盘 WebDAV
- ddns; frps; kms
- BearDropper (公网 ssh 防御)
- ServerChan
