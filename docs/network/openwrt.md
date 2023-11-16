# openwrt


## 概念

luci op的页面, 如果需要使用页面管理插件, 需要安装luci-app-*的包
opkg op的软件包管理程序, opkg install; list ; 
uci op的配置文件配置器

## 安装

下载老朱推荐: https://www.right.com.cn/forum/thread-8293351-1-1.html
目前使用 openwrt6.1-jpxb-20231028-x86-64-generic-squashfs-combined-efi.img https://www.right.com.cn/forum/thread-8286335-1-1.html
后续使用openwrt.ai生成

按照品牌搜索下载对应的 sysupdate.bin 包
pve安装 `qm importdisk 100 /var/lib/vz/template/iso/xx.img local` ; 然后磁盘添加; 设置硬盘启动; 启动后修改密码; ip: 192.168.2.1
vi /etc/config/network

## 插件

- 首页改用 nginx
- 去掉科学上网;dns 过滤; arpbind; cifs-mount; cpulimit; filebrowser; eqos; easymesh; ;
- adbyby广告屏蔽
- 网络存储都要 aria2 nfs ftp Samba4 Transmission
- vpn 都要 v2ray; openvpn; IPSec VPN; PPTP VPN 服务器
- 阿里云盘 FUSE
- 阿里云盘 WebDAV
- ddns; frps; kms
- BearDropper (公网 ssh 防御)
- ServerChan
- nlbw 宽带监控
- accesscontrol 访问时间控制
- abdlock ABD广告过滤
- amule amule下载工具
- dockerman docker 
### 常用的包
- netdata (性能检测) `cd /usr/share/netdata/web  chown -R root:root *`
- acme 自动化ssl证书管理
- aria2 下载工具
- arpbind ip/mac绑定
- autoreboot 计划重启
- ddns 各种厂商的ddns服务
- frps frp服务端 看情况安装
- samba4
- smartdns dns服务器
- vsftp 
- nginx-manager
- diskman 磁盘管理
- wechatpush 微信推送
- wolplus
- turboacc 网络加速
- alist 多网站网盘文件列表


## 配置

### uhttpd

配置 https 则配置 `/etc/config/uhttpd`文件(https://openwrt.org/docs/guide-user/services/webserver/uhttpd)
或者使用 luci(页面)配置 (配置了 ssl 证书需要其他端口转发到 443 同时需要使用 https 协议访问)

```shell
uci show uhttpd.main
uhttpd.main=uhttpd
uhttpd.main.listen_http='0.0.0.0:80'
uhttpd.main.listen_https='0.0.0.0:443'
uhttpd.nain.tcp_keepalive='1'
uhttpd.main.rfc1918_filter='0'
uhttpd.main.key='/etc/luci-uploads/cbid.uhttpd.main.key'
uhttpd.main.cert='/etc/luci-uploads/cbid.uhttpd.main.cert'
uhttpd.main.redirect_https='1'  # 或者0 在内网无所谓
```

- acme 泛域名证书申请 : https://github.com/acmesh-official/acme.sh/wiki/%E8%AF%B4%E6%98%8E
- 系统-启动项-appfilter 关闭自启动

### nginx

#### 查看 nginx 初始配置

https://blog.csdn.net/m0_46645810/article/details/129034751

设置了 root 目录 restrict_locally 是内网主机, 也就是默认配置做了 80 => 443 然后只允许内网的一个 web 服务器, ssl 证书是 openwrt 自带的

```shell
cat /etc/nginx/uci.conf

root/www;
server { #see uci show 'nginx._lan'
    listen 443 ssl default_seruer;
    listen [::]:443 ssl default_seruer;
    seruer_name _lan;
    include restrict_locally;
    include conf.d/*.locations;
    ssl_certificate /etc/nginx/conf.d/_lan.crt;
    ssl_certificate_key/etc/nginx/conf.d/_lan.key;
    ssl_session_cache shared:SSL:32k;
    ssl_session_timeout 64m;
    access_log off; #t logd openurt;
}

server { #see uci shou 'nginx. redirect2ssl'
    listen 80;
    listen [::]:80;
    seruer_name _redirect2ssl;
    return 302 https://Shost$request_uri;
}
include conf.d/*.conf;
```

#### 自行设置 nginx

1. 取消 uci 接管 nginx [可选]
   ```shell
    uci set nginx.global.uci_enable=false
    uci commit nginx
   ```
2. 修改/etc/nginx/nginx.conf 文件或者 uci.conf 支持外网访问


### ssl
https://github.com/acmesh-official/acme.sh/wiki/%E8%AF%B4%E6%98%8E
