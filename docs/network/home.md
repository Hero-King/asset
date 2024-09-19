# 家庭网络中客厅到弱电箱只有一根网线怎么办?单臂路由?还是...

# 笔者家里的网络情况

主要有 四口千兆光猫; K2p路由器; 无屏老笔记本 ; 若干笔记本,台式机上网设备;

无屏老笔记本安装黑群晖和Openwrt路由系统



## 需求

- 家庭中只有一个子网
- 设备不固定IP, 使用dhcp协议, 能够通过域名访问设备
- 所有设备支持IPv6

# 方式一使用Openwrt单臂路由

## TODO拓扑图



## 光猫配置

1. 改成桥接, Internet业务取消所有的端口绑定, (按需设置Lan1端口的Vlan绑定)
2. 关闭DHCP服务

## Openwrt配置

需要Wan口拨号上网, Lan口连接子网设备, **同时绑定你的物理网卡(一般eth0)**

开启DHCP; DNS服务器



OP接口配置如下

```
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



>https://www.right.com.cn/forum/thread-5768047-1-1.html
>
>https://www.right.com.cn/FORUM/thread-6196997-1-1.html
>
>https://www.right.com.cn/forum/thread-4066357-1-1.html



## Nginx配置转发相关web

```
proxy_connect_timeout 300s;
proxy_read_timeout 300s;
proxy_send_timeout 300s;
proxy_redirect off;
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-Host $server_name;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header X-Forwarded-Ssl on;

ssl_certificate "/etc/acme/heroking.top/fullchain.cer";
ssl_certificate_key "/etc/acme/heroking.top/heroking.top.key";
ssl_session_timeout  10m;

# http请求转换成https
error_page 497 https://$host:$server_port$request_uri;

server {
  listen 8000 default_server ssl; #bind prot 绑定的端口
  listen [::]:8000 default_server ssl;
  server_name _;
  #root /web; #directory 网站路径

  gzip on;
  gzip_types text/plain application/json application/javascript application/x-javascript text/css application/xml text/javascript;
  gzip_proxied  any;
  gzip_vary on;
  gzip_comp_level 6;
  gzip_buffers 16 8k;
  gzip_http_version 1.0;

  location ^~ /ray {
    proxy_pass http://127.0.0.1:10000;#假设WebSocket监听在环回地址的10000端口上
  }
  location / {
    root /web/ruoyi-ui;
    try_files $uri $uri/ /index.html;
    index  index.html index.htm;
  }

  location /prod-api/ {
    proxy_set_header Host $http_host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header REMOTE-HOST $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_pass http://192.168.1.150:8080/;
  }
}

server {
  listen 8000;
  listen [::]:8000;
  server_name pve.heroking.top;
  location / {
    #这里设置pve地址
    proxy_pass https://192.168.2.2:8006;
  }
}

server {
  listen 8000;
  listen [::]:8000;
  server_name k2p.heroking.top;
  auth_basic   "Administrator’s Area";
  auth_basic_user_file /etc/nginx/htpasswd.conf;
  location / {
    #这里设置pve地址
    proxy_pass http://192.168.2.10;
  }
}


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
  location ^~ /ray {
    proxy_pass http://127.0.0.1:10000;#假设WebSocket监听在环回地址的10000端口上
  }
  location ^~ /tv {
    return 302 https://饭太硬.com/tv;
#    rewrite ^/(.*) https://饭太硬.top/tv redirect;
  }
  location /public/ {
    root /web;
  }
  location /auth/ {
    root /web;
    if ($query_string !~* "auth=xxx") {  
      return 403;
    }
  }
}
```



# 方式二使用K2p当核心路由Op旁路由

k2p使用dnsmasq软件提供简单的dns服务, 主要配置如下; 

这种方式下位于书房的电脑book与核心路由下的设备不属于同一个子网了,相互通信的话需要设置电脑book的静态路由`route -n add -net 192.168.2.0/24 192.168.1.2(k2p WanIp)`

## TODO 补充架构图



## dnsmasq
```text
address=/blog.heroking.top/185.199.108.153
address=/pan.heroking.top/185.199.108.153
address=/nav.heroking.top/185.199.108.153
cname=blog.heroking.top,hero-king.github.io
cname=pan.heroking.top,hero-king.github.io
cname=nav.heroking.top,hero-king.github.io
address=/op.heroking.top/192.168.2.1
address=/.heroking.top/192.168.2.4
```
子网下的设备通过DNS服务可以通过域名访问到相关设备,  **书房的电脑就比较尴尬, 尝试手动指定DNS为k2p WanIp, 但是不生效,网络timeout**



## host

```text
127.0.0.1 broadcom.broadcom broadcom
192.168.2.10 p.to
192.168.2.10 phicomm.me
192.168.2.4 nas.heroking.top
```



# 方式三光猫主路由Openwrt旁路由

