#! /bin/bash
# description gost服务端 代理服务器 https://github.com/ginuerzh/gost
# 多端口监听
# 可设置转发代理，支持多级转发(代理链)
# 支持标准HTTP/HTTPS/HTTP2/SOCKS4(A)/SOCKS5代理协议
# Web代理支持探测防御
# 支持多种隧道类型
# SOCKS5代理支持TLS协商加密
# Tunnel UDP over TCP
# TCP/UDP透明代理
# 本地/远程TCP/UDP端口转发
# 支持Shadowsocks(TCP/UDP)协议
# 支持SNI代理
# 权限控制
# 负载均衡
# 路由控制
# DNS解析和代理
# TUN/TAP设备

# docker pull ginuerzh/gost
docker stop gost ;
docker rm gost ;

# http
# docker run -d --name gost  -p 8999:8080  ginuerzh/gost '-L=adminqwer:123456rewq@:8080'

# 带验证信息 注意@后面不要跟localhost 这样只会接受本机的8080请求
docker run -d --name gost -v /etc/pki/nginx:/pki -p 8999:8080 ginuerzh/gost '-L=https://adminqwer:123456rewq@:8080?cert=/pki/server_heroking_top.pem&key=/pki/private/server_heroking_top.key'

# "-L=socks5://adminqwer:123456rewq@:8999 -L=https://adminqwer:123456rewq@:8998?cert=/pki/server_heroking_top.pem&key=/pki/private/server_heroking_top.key"

# 无验证信息
# docker run --name gost -v /etc/pki/nginx:/pki -p 8999:8080 ginuerzh/gost '-L=https://:8080?cert=/pki/server_heroking_top.pem&key=/pki/private/server_heroking_top.key'

# 更改enterypoint
# docker run -d --name gost -v /etc/pki/nginx:/pki -p 8999:8999 -p 8998:8998 -it --entrypoint /bin/sh ginuerzh/gost 