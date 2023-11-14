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
- location 路径匹配 有多种匹配规则 `Nginx服务器会首先会检查多个location中是否有普通的uri匹配，如果有多个匹配，会先记住匹配度最高的那个。然后再检查正则匹配，这里切记正则匹配是有顺序的，从上到下依次匹配配成功，则结束检查，并就会使用这个location块处理此请求。如果正则匹配全部失败，就会使用刚才记录普通uri匹配度最高的那个location块处理此请求。`
- location.root 设置当前 location 对应的根目录,使得访问的文件路径是 ${root}/${location}
- location.alias 当前 location 对应的目录,访问的资源路径不会拼接 location, alias 的处理结果是: 使用 alias 定义的路径
- location.proxy_pass url 后面的 url 如果带/ 则会处理成绝对路径(请求会忽略 location 后的路径) 不带/ 则转发后请求的 URL 是 拼接 location 的路径
- location.try_files 找不到 url 对应的资源时返回哪个文件 `try_files $uri $uri/ /index.html` 注意路径是对于 root 的路径

### location 规则

- "=" 精准匹配, 必须完全相同才能匹配上, 匹配后停止后续匹配，直接执行该匹配
  ```shell
    location = /abc {
    # do something 表示只有当请求的URI为“/abc”时才会匹配到这个location，其他的URI都不会匹配到。
    }
  ```
- “^~” 前缀匹配 找到普通 uri 匹配度最高的那个 location 后，立即处理此请求，并不再进行正则匹配
  ```shell
    location ^~ /abc {
    # do something  表示当请求的URI以“/abc”开头时，就匹配到这个location。如果有多个location都匹配到了同一个URI，那么nginx会选择最长的前缀匹配来处理请求。
    }
  ```
- “~”，执行正则匹配，区分大小写 按顺序匹配，一旦匹配上即停止后续匹配
- “~\*”，执行正则匹配，忽略大小写 按顺序匹配，一旦匹配上即停止后续匹配
- 普通匹配 不加任何规则时，默认是大小写敏感，前缀匹配，相当于加了“~”与“^~” 匹配后，继续更长前缀匹配和正则匹配。

#### 匹配顺序

在 nginx 中，location 指令的匹配顺序是按照精确匹配、前缀匹配、正则表达式匹配的顺序进行。也就是说，当有多个 location 都可以匹配到同一个 URI 时，会优先选择精确匹配，然后是前缀匹配，最后是正则表达式匹配。

### 多 server 模块

1. 首先选择所有的字符串完全匹配的 server_name。（完全匹配）
2. 选择通配符在前面的 server_name，如\*.mumusir.com www.mumusir.com
3. 选择通配符在后面的 server_name，如 mumusir.\* mumusir.com mumusir.cn
4. 最后选择使用正则表达式匹配的 server_name，如~^www\.(.\*)\.com$
5. 如果全部都没有匹配到，那么将选择在 listen 配置项后加入[default_server]的 server 块
6. 如果没写，那么就找到匹配 listen 端口的第一个 Server 块的配置文件 #如果通过 ip 访问，会直接到 5，判断是否有 default_server 的 server 块，就走 6

## Example

### 前端路由项目 NGINX 配置

#### 单项目配置

```js
// 资源路径 /new_home/books/index.html
location /books {
  root /new_home;
  try_files $uri $uri/ /books/index.html;
  index  index.html index.htm;
}

```

#### 多项目配置

直接设置 root 路径为多个项目资源的存放目录

```shell
root /var/www/aml;
index index.html;
```

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
