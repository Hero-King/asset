# nginx

## Install

使用包管理器安装 nginx

```shell
yum search nginx # 可以看到有nginx包 也有nginx可动态加载的模块 nginx-mod-stream nginx-mod-devel  nginx-all-modules(带所有动态模块版本)
yum install nginx # 或者其他nginx内容

yum install nginx-mod-stream -y  # 安装stream模块
rpm -ql nginx-mod-stream # 查看包nginx-mod-stream创建了哪些文件 如下
# /usr/lib64/nginx/modules/ngx_stream_module.so 此文件被mod-stream.conf中 load_module
# /usr/share/nginx/modules/mod-stream.conf 此文件被nginx.conf include到配置中
```

> 如果需要正向代理 请安装第三方 ngx_http_proxy_connect_module 模块 需要编译安装 使用 gost 也可以代理

## config

### 目录

- http 中 include /etc/nginx/conf.d/_.conf 用户分离 server 配置,多个虚拟主机的配置可以在`/etc/nginx/conf.d/`中创建`_.conf 文件`放置 server 配置
- server 中 include /etc/nginx/default.d/\*.conf 因此在这个目录中的文件需要写 server 中的配置项

### 配置项

- server_name 指定主机名或者说域名,支持访问不同域名同端口区分项目
- location 路径匹配 有多种匹配规则
- location.root 设置当前 location 对应的根目录,使得访问的文件路径是 ${root}/${location}
- proxy_pass url 后面的 url 如果带/ 则会处理成绝对路径(请求会忽略 location 后的路径) 不带/ 则转发后请求的 URL 是 拼接 location 的路径
- try_files 找不到 url 对应的资源时返回哪个文件 `try_files $uri $uri/ /index.html` 注意路径是对于 root 的路径

## Example

前端路由项目 NGINX 配置

```js
// 资源路径 /new_home/books/index.html
location /books {
    root /new_home;
    try_files $uri $uri/ /books/index.html;
    index  index.html index.htm;
}

```

v2ray 配置

```shell
location /ray { # 与 V2Ray 配置中的 path 保持一致
    proxy_redirect off;
    proxy_pass http://127.0.0.1:10000;#假设WebSocket监听在环回地址的10000端口上
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $http_host;
    # Show realip in v2ray access.log
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}

{
  "log": {
    "loglevel": "warning",
    "access": "/var/log/v2ray/access.log",
    "error": "/var/log/v2ray/error.log"
  },

  "inbounds": [
    {
      "port": 10000,
      "listen": "127.0.0.1",
      "protocol": "vmess",
      "settings": {
        "clients": [
          {
            "id": "b831381d-6384-4d53-ad4f",
            "alterId": 0
          }
        ]
      },
      "streamSettings": {
        "network": "ws",
        "wsSettings": {
          "path": "/ray"
        }
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom",
      "settings": {}
    }
  ]
}

```
