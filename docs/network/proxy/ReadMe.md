# 代理和内网穿透

## 代理

主要有以下几种

- 正向代理: 代理客户端去请求服务器
- 反向代理: 代理服务端, 用户请求的是代理服务器, 代理服务器请求真实目的主机

按照代理方式, 目前主要有 http 代理, socks 代理, 对于目前主流的 Https 协议, http 代理无能为力

## 代理软件

- gost
- v2ray

## 内网穿透

内网穿透又叫 nat 穿透, 本质就是解决 ipv4 供应不足问题
正常上网路径: 内网设备 -> 内网设备 -> ... -> 运营商公网机器 nat -> 服务器 -> 运营商公网机器 nat -> 内网设备 -> ... -> 内网设备
也就是可以从外网访问到内网机器的
内网穿透原理就是这个
内网服务器先和公网 IP 机器建立连接 后面由客户端请求到公网服务器 IP:PORT 公网机器把请求转发到之前建立的连接中 达到访问内网服务器的目的 但是常见的内网穿透软件(花生壳 frp) 都是针对**端口进行转发**
想要访问内网机器 可以使用 VPN 、 v2ray 反向代理

## openvpn

https://www.ilanni.com/?p=9837 烂泥写的挺好的

## PPTP

docker run --name pptpd --privileged --net=host -d -p 1723:1723 -v /etc/ppp/chap-secrets:/etc/ppp/chap-secrets:ro whuwxl/pptpd
端口 1723 映射

## ipsec-vpn/L2tp

https://github.com/hwdsl2/setup-ipsec-vpn
ipsec 是对 l2tp 基础上加密处理
路由器上的服务端是 l2tp 不带 ipsec 所以 windows 客户端设置的时候 [安全] 高级设置不选 PSC 秘钥,不选证书验证,数据加密不加密 默认 vpn 是全局流量代理
L2TP 需开放端口：
UDP:500
UDP:4500
UDP:1701

## 使用 frp 内网穿透 esxi

- 1024 以下端口需要使用 root 用户启动 frps (注释 frps.service 中的 User=nobody)
- frps 服务注册 /usr/lib/systemd/system/frps.service
- frpc 映射 443 和 902 端口

  ```
  [esxi-web]
  remote_port = 9443
  type = tcp
  local_ip = 192.168.123.100
  local_port = 443

  [esxi-client-windowt]
  remote_port = 902
  type = tcp
  local_ip = 192.168.123.100
  local_port = 902
  ```

- nginx 设置 301 重定向 http 转 https
  ```
  server {
          listen       80;
          listen       [::]:80;
          server_name  _;
          # rewrite ^(.*)$ https://$host$1; #将所有HTTP请求通过rewrite指令重定向到HTTPS。
          # $host代表请求头中的host $server_name代表上面匹配的虚拟主机名称(即_)
          return 301 https://$host$request_uri;
      }
  ```
- 多域名解析到真实主机  
   我设置 esxi.domain 解析到主机,申请域名免费 ssl 证书
- nginx 配置虚拟主机
  **注意 nginx 是否支持 TLS SNI (nginx -V 查看 TLS SNI support enabled)**
  如果不支持 需要将 esxi 的虚拟 server 段放在最上面 当成默认的虚拟主机 应为 vmware 客户端不支持 SNI

  ```
   server {
     listen       443 ssl ;
     listen       [::]:443 ssl ;
     server_name  域名;

     ssl_certificate "/etc/pki/nginx/XXX.pem";
     ssl_certificate_key "/etc/pki/nginx/private/XXX.key";
     ssl_session_timeout  10m;
     ssl_ciphers HIGH:!aNULL:!MD5;
     ssl_prefer_server_ciphers on;

      location / {
          proxy_pass https://127.0.0.1:port;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header Host $host;
          # proxy_set_header X-Forward-Proto https;

          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection "upgrade";
      }
  }
  # ...其他虚拟主机
  ```
