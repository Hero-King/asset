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

<a href="https://docs.nginx.com/nginx/admin-guide/web-server/web-server/" >nginx 配置成 web 服务器上手文档</a>

为了方便描述,先定义几个变量
`locationPath`: server.location 配置项后面定义的路径, 路径匹配的话请写上末尾的`/`
`resetUrl`: 客户端请求 url 裁减掉 locationPath 后的内容

- listen 监听端口 listen 127.0.0.1:8080; listen 80 default_server[可选];
- server_name 指定主机名或者说域名,支持访问不同域名同端口区分项目 如 server_name example.org www.example.org;
- <a href="https://nginx.org/en/docs/http/ngx_http_core_module.html#location"> location </a> 路径匹配, 注意写法,路径后面带上/ 有多种匹配规则 `Nginx服务器会首先会检查多个location中是否有普通的uri匹配，如果有多个匹配，会先记住匹配度最高的那个。然后再检查正则匹配，这里切记正则匹配是有顺序的，从上到下依次匹配配成功，则结束检查，并就会使用这个location块处理此请求。如果正则匹配全部失败，就会使用刚才记录普通uri匹配度最高的那个location块处理此请求。`
- location.root 设置当前 location 对应的根目录,url 访问的文件路径是 `${root}/${url}` (root 后路径带不带/ 无影响, 官方都是写上的)
- location.alias url1 当前 location 查找资源的目录,访问的资源路径是去掉 locationPath 的, 即`${alias}/${resetUrl}` ;注意: locationPath 和 url1 后末尾必须同时带'/'或者同时不带
- location.proxy_pass url1 **url1 和 locationPath 至少有一个末尾以'/'结尾**, urll 以'/'结尾,新 url 舍弃 locationPath 理解为`${url1}${resetUrl}`, 不以'/'结尾 理解成`${url1}${locationPath}${resetUrl}` 约等于原始路径 原文: https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass
- location.try_files 找不到 url 对应的资源时返回哪个文件 `try_files $uri $uri/ /index.html` 注意路径是对于 root 的路径

> 测试目录 /test/index.html(页面 1) /test/dist/index.html(页面 2) /test/dist/assets/img.png
> nginx 默认会把/dist 301 重定向到 /dist/

| location     | 配置                                  | 页面 1      | 页面 2     | 图片                      | 备注                                                           |
| ------------ | ------------------------------------- | ----------- | ---------- | ------------------------- | -------------------------------------------------------------- |
| /            | root:E:/test                          | /           | /dist      | /dist/assets/img.png      |                                                                |
| /            | root:E:/test/                         | /           | /dist      | /dist/assets/img.png      |                                                                |
| /dist        | root:E:/test                          | no          | /dist      | /dist/assets/img.png      |                                                                |
| /dist/       | root:E:/test/                         | no          | /dist      | /dist/assets/img.png      |                                                                |
| ~ \.(png)$   | root:E:/test                          | no          | no         | /dist/assets/img.png      |                                                                |
| =/index.html | root:E:/test                          | /index.html | no         | no                        | url 完全匹配                                                   |
| /Dist/       | root:E:/test                          | no          | /dist      | no                        |                                                                |
| /            | proxy_pass:http://localhost:300       | /           | /dist      | /dist/assets/img.png      |                                                                |
| /dist/       | proxy_pass:http://localhost:300       | no          | /dist      | /dist/assets/img.png      | proxy_pass 后面内容无 / 写法正确时则将客户端原始 url 转发      |
| /dist/       | proxy_pass:http://localhost:300/      | /dist       | /dist/dist | /dist/dist/assets/img.png | 所以 proxy_pass 改成 :3000/dist/跟上一阿行同效果               |
| /            | proxy_pass:http://localhost:300/dist  | no          | /          | 访问不到!!                | 客户端/dist 会被处理成/distdist 相当于根据 location 匹配后拼接 |
| /            | proxy_pass:http://localhost:300/dist/ | no          | /          | /assets/img.png           |                                                                |
| /            | alias:E:/test/                        | /           | /dist      | /dist/assets/img.png      |                                                                |
| /dist/       | alias:E:/test/                        | /dist       | /dist/dist | /dist/dist/assets/img.png | alias 后面加上 dist 目录即可省掉后面 dist 前缀                 |

### location 规则

- "=" 精准匹配, 必须完全相同才能匹配上, 匹配后停止后续匹配，直接执行该匹配
  ```shell
    location = /abc {
    # do something 表示只有当请求的URI为“/abc”时才会匹配到这个location，其他的URI都不会匹配到。
    }
  ```
- “^~” 前缀匹配 找到普通 uri 匹配度最高的那个 location 后，立即处理此请求，并不再进行正则匹配
  ```shell
    location ^~ /abc/ {
    # do something  表示当请求的URI以“/abc”开头时，就匹配到这个location。如果有多个location都匹配到了同一个URI，那么nginx会选择最长的前缀匹配来处理请求。
    }
  ```
- “~”，执行正则匹配，区分大小写 按顺序匹配，一旦匹配上即停止后续匹配
- “~\*”，执行正则匹配，忽略大小写 按顺序匹配，一旦匹配上即停止后续匹配
- 普通匹配 不加任何规则时，前缀匹配，继续更长前缀匹配和正则匹配。

#### 匹配顺序

在 nginx 中，location 指令的匹配顺序是按照精确匹配、前缀匹配、正则表达式匹配的顺序进行。也就是说，当有多个 location 都可以匹配到同一个 URI 时，会优先选择精确匹配，然后是前缀匹配，最后是正则表达式匹配。

### 多 server 模块

1. 首先选择所有的字符串完全匹配的 server_name。（完全匹配）
2. 选择通配符在前面的 server_name，如\*.mumusir.com www.mumusir.com
3. 选择通配符在后面的 server_name，如 mumusir.\* mumusir.com mumusir.cn
4. 最后选择使用正则表达式匹配的 server_name，如~^www\.(.\*)\.com$
5. 如果全部都没有匹配到，那么将选择在 listen 配置项后加入[default_server]的 server 块
6. 如果没写，那么就找到匹配 listen 端口的第一个 Server 块的配置文件 #如果通过 ip 访问，会直接到 5，判断是否有 default_server 的 server 块，就走 6

### 重定向
return/rewrite关键字
https://nginx.org/en/docs/http/ngx_http_rewrite_module.html

## Example

### 代理/api 请求

```shell
location /api/ {
  proxy_pass http://IP:Port/;
  proxy_connect_timeout 15s;
  proxy_send_timeout 15s;
  proxy_read_timeout 15s;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto http;
}
```

### 一个 server 块托管多个前端项目

```js
// 资源路径 /new_home/books/index.html
location /books {
  root /new_home;
  try_files $uri $uri/ /books/index.html;
  index  index.html index.htm;
}

```

或者直接设置 root 路径为多个项目资源的存放目录

```shell
root /var/www/aml;
index index.html;
```

### 项目文件目录与 locationPath 不一致

```shell
  location /ems/ {
    alias E:/test/dist/;
  }
```

### 一个 server 块反向代理多个服务

- 方案一: 通过 location 去区分不同服务主机, proxy_pass 使用末尾'/'的方式, 但是要求服务的所有资源带固定前缀 或者用的'./'相对路径加载资源
- 方案二: 使用虚拟主机功能

### v2ray 配置

```shell
location ^~ /ray { # 与 V2Ray 配置中的 path 保持一致
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

### 图片静态资源缓存

每次前端打包拷贝到服务器上都会是新的文件, nginx 默认使用文件修改时间和大小生成 ETag, 如果想用文件内容的散列值生成 ETag, 可以使用 etag_hash 指令来进行配置, 所以想要缓存还是用强缓存

在设置缓存的同时`注意 NGINX location 的匹配顺序`

```shell
  #静态资料目录
  location ~* \.(gif|jpg|jpeg|bmp|png|ico|txt|css)$
  {
     expires  30d;
  }

```
