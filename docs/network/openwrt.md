# openwrt

## 概念

luci op 的页面, 如果需要使用页面管理插件, 需要安装 luci-app-\*的包
opkg op 的软件包管理程序, opkg install; list ;
uci op 的配置文件配置器

## 资料

野火 OpenWrt 用户手册 ： https://doc.embedfire.com/openwrt/user_manal/zh/latest/index.html

## 安装

后续使用 openwrt.ai 生成

按照品牌搜索下载对应的 sysupdate.bin 包
pve 安装 `qm importdisk 100 /var/lib/vz/template/iso/xx.img local --format qcow2` ; (100 是 VMid) 然后磁盘添加; 设置硬盘启动; 启动后修改密码; ip: 192.168.2.1 修改 ip `vi /etc/config/network`

ipv6 可能需要 21.02.3 版本

## 插件

- 首页改用 nginx
- 去掉科学上网;dns 过滤; arpbind; cifs-mount; cpulimit; filebrowser; eqos; easymesh; ;
- adbyby 广告屏蔽
- 网络存储都要 aria2 nfs ftp Samba4 Transmission
- vpn 都要 v2ray; openvpn; IPSec VPN; PPTP VPN 服务器
- 阿里云盘 FUSE
- 阿里云盘 WebDAV
- ddns; frps; kms
- BearDropper (公网 ssh 防御)
- ServerChan (微信推送)
- nlbw 宽带监控
- accesscontrol 访问时间控制
- abdlock ABD 广告过滤
- amule amule 下载工具
- dockerman docker 执行 /etc/init.d/dockerd 管理docker 设置开启启动: ln -s /etc/init.d/dockerd /etc/rc.d/S100docker
- kodexplorer 可道云（像 windows 一样管理文件）
- AdGuard Home 去广告插件(原理 dns 劫持)

### 常用的包

- ttyd web shell
- v2ray-server

### 常用的包

- netdata (性能检测) `cd /usr/share/netdata/web  chown -R root:root *`
- acme 自动化 ssl 证书管理
- aria2 下载工具
- arpbind ip/mac 绑定
- autoreboot 计划重启
- ddns 各种厂商的 ddns 服务
- frps frp 服务端 看情况安装
- samba4
- smartdns dns 服务器
- vsftp
- nginx-manager
- diskman 磁盘管理
- wechatpush 微信推送
- wolplus
- turboacc 网络加速
- alist 多网站网盘文件列表
- zerotier 零盾 异地组网 内网穿透 vpn

## 配置

### smartdns
```text
cname /blog.heroking.top/hero-king.github.io
cname /pan.heroking.top/hero-king.github.io
cname /nav.heroking.top/hero-king.github.io
address /heroking.top/192.168.2.4
```

### Passwall

https://bingmeme.github.io/OpenWrt_CN/tips/passwallURLfenliu.html#:~:text=%E7%9B%AE%E5%89%8Dpasswall%20%E8%8A%82%E7%82%B9%E5%88%97%E8%A1%A8%E9%87%8C%20%E5%87%BA%E5%8E%82%E4%BC%9A%E8%87%AA%E5%B8%A6%E4%B8%80%E4%B8%AA%E5%B7%B2%E7%BB%8F%E5%BB%BA%E7%AB%8B%E5%A5%BD%E7%9A%84%E2%80%9C%E5%88%86%E6%B5%81%E6%80%BB%E8%8A%82%E7%82%B9%E2%80%9D%EF%BC%8C%E5%A6%82%E4%B8%8B%E5%9B%BE%EF%BC%9A%20%E5%A6%82%E6%9E%9C%E6%82%A8%E6%89%8B%E8%B4%B1%E5%88%A0%E9%99%A4%E5%BC%84%E6%B2%A1%E4%BA%86%E8%BF%99%E4%B8%AA%20%E5%88%86%E6%B5%81%E6%80%BB%E8%8A%82%E7%82%B9%20%EF%BC%8C%E4%B9%9F%E6%B2%A1%E4%BA%8B%EF%BC%8C%E6%89%8B%E5%8A%A8%E6%B7%BB%E5%8A%A0%E5%9B%9E%E6%9D%A5%E7%9A%84%E6%B5%81%E7%A8%8B%E6%98%AF%EF%BC%9A,%E4%B8%8A%E5%9B%BE%E7%9A%84%20%E7%B1%BB%E5%9E%8B%20%E5%8F%AF%E9%80%89Xray%E6%88%96%E8%80%85V2ray%EF%BC%8C%E5%AE%83%E4%BB%AC%E7%9A%84%20%E4%BC%A0%E8%BE%93%E5%8D%8F%E8%AE%AE%20%E9%87%8C%E9%83%BD%E6%9C%89%20%E5%88%86%E6%B5%81%20%EF%BC%8C%E4%BD%BF%E7%94%A8%E6%95%88%E6%9E%9C%E5%B7%AE%E4%B8%8D%E5%A4%9A%E3%80%82

https://www.right.com.cn/forum/thread-8325875-1-1.html

#### 只想特定机器走代理?

可以使用 passwall 的 socks 代理服务器, 在基本设置中=>socks 设置, 直接配置一个 socks 服务器, 在 Windows/Mac 中使用即可

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
2. 修改/etc/nginx/nginx.conf 文件或者 uci.conf [可选]
3. 在/etc/nginx/conf.d/下新建配置文件, 监听其他端口, 防火墙开放, 使用 nginx 转发内网 web 服务

### ssl-acme

acme 使用 : https://github.com/acmesh-official/acme.sh/wiki/%E8%AF%B4%E6%98%8E

页面配置: 常规设置域名先写主域名,其他域名,后写泛解析域名(\*.域名) 验证方式`dns`;DnsAPI`dns_ali`; API 凭证列表: `Ali_Key="<key>" Ali_Secret="<secret>"`
软件库搜索 dnsapi 安装
执行 acme: `service acme start`, acme 安装在 /usr/lib/acme/client/acme.sh ,
ssl 证书目录 `/etc/acme/域名/域名.key和fullchain.cer`， 在 nginx 中配置即可

### v2ray

在 ui 中配置好，勾选允许访问内网

### minidlna

家庭流媒体， 只需要调整下媒体目录，启用即可 后台监控可以访问网关:8200

### BearDropper

安装 luci-app-BearDropper

### alist

配置好端口, 如果需要外网访问需要防火墙放行, 启用 ssl, 数据目录不调整, 缓存目录默认`/tmp/alist`, 如果需要离线下载大文件, 调整此目录到新的磁盘分区中

### netdata

默认不支持 https

修改`/usr/lib/lua/luci/view/netdata.htm`

```js
if (window.location.hostname.includes('heroking.top')) {
  document.getElementById('netdata').src = 'https://' + window.location.hostname + ':8000/netdata/'
} else {
  document.getElementById('netdata').src = 'http://' + window.location.hostname + ':19999'
}
```

使用 nginx 代理网页

```shell

server {
  listen 8000;
  listen [::]:8000;
  server_name op.heroking.top;
  location / {
    proxy_pass https://192.168.2.1;
  }

  location ^~ /netdata/ {
     proxy_pass http://127.0.0.1:19999/;
  }
}

```

### 上网

#### 单臂路由

https://www.right.com.cn/forum/thread-5768047-1-1.html
https://www.right.com.cn/FORUM/thread-6196997-1-1.html

光猫不设置 vlan 也可以

```shell
config interface 'loopback'
        option device 'lo'
        option proto 'static'
        option ipaddr '127.0.0.1'
        option netmask '255.0.0.0'

config globals 'globals'
        option ula_prefix 'fdf6:076a:018b::/48'
        option packet_steering '1'

config device
        option name 'br-lan'
        option type 'bridge'
        list ports 'eth0'
        option promisc '1'

config interface 'lan'
        option device 'eth0'
        option proto 'static'
        option ipaddr '192.168.2.1'
        option netmask '255.255.255.0'
        option ip6assign '60'

config interface 'wan'
        option proto 'pppoe'
        option username 'xxx'
        option password 'xxx'
        option device 'eth0'
        option ipv6 'auto'

```

## nav

使用 github pages 搭建个人导航页

## k2p
### dnsmasq
```text
address=/heroking.top/192.168.2.4
#cname=blog.heroking.top,hero-king.github.io
#cname=pan.heroking.top,hero-king.github.io
#cname=nav.heroking.top,hero-king.github.io
address=/blog.heroking.top/185.199.108.153
address=/pan.heroking.top/185.199.108.153
address=/nav.heroking.top/185.199.108.153
```
### host
```text
127.0.0.1 broadcom.broadcom broadcom
192.168.2.10 p.to
192.168.2.10 phicomm.me
192.168.2.4 nas.heroking.top
```