(window.webpackJsonp=window.webpackJsonp||[]).push([[29],{448:function(t,s,a){"use strict";a.r(s);var n=a(31),e=Object(n.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"nginx"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#nginx"}},[t._v("#")]),t._v(" nginx")]),t._v(" "),s("h2",{attrs:{id:"install"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#install"}},[t._v("#")]),t._v(" Install")]),t._v(" "),s("p",[t._v("使用包管理器安装 nginx")]),t._v(" "),s("div",{staticClass:"language-shell extra-class"},[s("pre",{pre:!0,attrs:{class:"language-shell"}},[s("code",[t._v("yum search nginx "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 可以看到有nginx包 也有nginx可动态加载的模块 nginx-mod-stream nginx-mod-devel  nginx-all-modules(带所有动态模块版本)")]),t._v("\nyum "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("install")]),t._v(" nginx "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 或者其他nginx内容")]),t._v("\n\nyum "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("install")]),t._v(" nginx-mod-stream "),s("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("-y")]),t._v("  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 安装stream模块")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("rpm")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("-ql")]),t._v(" nginx-mod-stream "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 查看包nginx-mod-stream创建了哪些文件 如下")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# /usr/lib64/nginx/modules/ngx_stream_module.so 此文件被mod-stream.conf中 load_module")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# /usr/share/nginx/modules/mod-stream.conf 此文件被nginx.conf include到配置中")]),t._v("\n")])])]),s("blockquote",[s("p",[t._v("如果需要正向代理 请安装第三方 ngx_http_proxy_connect_module 模块 需要编译安装 使用 gost 也可以代理")])]),t._v(" "),s("h2",{attrs:{id:"config"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#config"}},[t._v("#")]),t._v(" config")]),t._v(" "),s("h3",{attrs:{id:"目录"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#目录"}},[t._v("#")]),t._v(" 目录")]),t._v(" "),s("ul",[s("li",[t._v("http 中 include /etc/nginx/conf.d/_.conf 用户分离 server 配置,多个虚拟主机的配置可以在"),s("code",[t._v("/etc/nginx/conf.d/")]),t._v("中创建"),s("code",[t._v("_.conf 文件")]),t._v("放置 server 配置")]),t._v(" "),s("li",[t._v("server 中 include /etc/nginx/default.d/*.conf 因此在这个目录中的文件需要写 server 中的配置项")])]),t._v(" "),s("h3",{attrs:{id:"配置项"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#配置项"}},[t._v("#")]),t._v(" 配置项")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://docs.nginx.com/nginx/admin-guide/web-server/web-server/"}},[t._v("nginx 配置成 web 服务器上手文档")])]),t._v(" "),s("p",[t._v("为了方便描述,先定义几个变量\n"),s("code",[t._v("locationPath")]),t._v(": server.location 配置项后面定义的路径, 路径匹配的话请写上末尾的"),s("code",[t._v("/")]),t._v(" "),s("code",[t._v("resetUrl")]),t._v(": 客户端请求 url 裁减掉 locationPath 后的内容")]),t._v(" "),s("ul",[s("li",[t._v("listen 监听端口 listen 127.0.0.1:8080; listen 80 default_server[可选];")]),t._v(" "),s("li",[t._v("server_name 指定主机名或者说域名,支持访问不同域名同端口区分项目 如 server_name example.org www.example.org;")]),t._v(" "),s("li",[s("a",{attrs:{href:"https://nginx.org/en/docs/http/ngx_http_core_module.html#location"}},[t._v(" location ")]),t._v(" 路径匹配, 注意写法,路径后面带上/ 有多种匹配规则 "),s("code",[t._v("Nginx服务器会首先会检查多个location中是否有普通的uri匹配，如果有多个匹配，会先记住匹配度最高的那个。然后再检查正则匹配，这里切记正则匹配是有顺序的，从上到下依次匹配配成功，则结束检查，并就会使用这个location块处理此请求。如果正则匹配全部失败，就会使用刚才记录普通uri匹配度最高的那个location块处理此请求。")])]),t._v(" "),s("li",[t._v("location.root 设置当前 location 对应的根目录,url 访问的文件路径是 "),s("code",[t._v("${root}/${url}")]),t._v(" (root 后路径带不带/ 无影响, 官方都是写上的)")]),t._v(" "),s("li",[t._v("location.alias url1 当前 location 查找资源的目录,访问的资源路径是去掉 locationPath 的, 即"),s("code",[t._v("${alias}/${resetUrl}")]),t._v(" ;注意: locationPath 和 url1 后末尾必须同时带'/'或者同时不带")]),t._v(" "),s("li",[t._v("location.proxy_pass url1 "),s("strong",[t._v("url1 和 locationPath 至少有一个末尾以'/'结尾")]),t._v(", urll 以'/'结尾,新 url 舍弃 locationPath 理解为"),s("code",[t._v("${url1}${resetUrl}")]),t._v(", 不以'/'结尾 理解成"),s("code",[t._v("${url1}${locationPath}${resetUrl}")]),t._v(" 约等于原始路径 原文: https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass")]),t._v(" "),s("li",[t._v("location.try_files 找不到 url 对应的资源时返回哪个文件 "),s("code",[t._v("try_files $uri $uri/ /index.html")]),t._v(" 注意路径是对于 root 的路径")])]),t._v(" "),s("blockquote",[s("p",[t._v("测试目录 /test/index.html(页面 1) /test/dist/index.html(页面 2) /test/dist/assets/img.png\nnginx 默认会把/dist 301 重定向到 /dist/")])]),t._v(" "),s("table",[s("thead",[s("tr",[s("th",[t._v("location")]),t._v(" "),s("th",[t._v("配置")]),t._v(" "),s("th",[t._v("页面 1")]),t._v(" "),s("th",[t._v("页面 2")]),t._v(" "),s("th",[t._v("图片")]),t._v(" "),s("th",[t._v("备注")])])]),t._v(" "),s("tbody",[s("tr",[s("td",[t._v("/")]),t._v(" "),s("td",[t._v("root:E:/test")]),t._v(" "),s("td",[t._v("/")]),t._v(" "),s("td",[t._v("/dist")]),t._v(" "),s("td",[t._v("/dist/assets/img.png")]),t._v(" "),s("td")]),t._v(" "),s("tr",[s("td",[t._v("/")]),t._v(" "),s("td",[t._v("root:E:/test/")]),t._v(" "),s("td",[t._v("/")]),t._v(" "),s("td",[t._v("/dist")]),t._v(" "),s("td",[t._v("/dist/assets/img.png")]),t._v(" "),s("td")]),t._v(" "),s("tr",[s("td",[t._v("/dist")]),t._v(" "),s("td",[t._v("root:E:/test")]),t._v(" "),s("td",[t._v("no")]),t._v(" "),s("td",[t._v("/dist")]),t._v(" "),s("td",[t._v("/dist/assets/img.png")]),t._v(" "),s("td")]),t._v(" "),s("tr",[s("td",[t._v("/dist/")]),t._v(" "),s("td",[t._v("root:E:/test/")]),t._v(" "),s("td",[t._v("no")]),t._v(" "),s("td",[t._v("/dist")]),t._v(" "),s("td",[t._v("/dist/assets/img.png")]),t._v(" "),s("td")]),t._v(" "),s("tr",[s("td",[t._v("~ .(png)$")]),t._v(" "),s("td",[t._v("root:E:/test")]),t._v(" "),s("td",[t._v("no")]),t._v(" "),s("td",[t._v("no")]),t._v(" "),s("td",[t._v("/dist/assets/img.png")]),t._v(" "),s("td")]),t._v(" "),s("tr",[s("td",[t._v("=/index.html")]),t._v(" "),s("td",[t._v("root:E:/test")]),t._v(" "),s("td",[t._v("/index.html")]),t._v(" "),s("td",[t._v("no")]),t._v(" "),s("td",[t._v("no")]),t._v(" "),s("td",[t._v("url 完全匹配")])]),t._v(" "),s("tr",[s("td",[t._v("/Dist/")]),t._v(" "),s("td",[t._v("root:E:/test")]),t._v(" "),s("td",[t._v("no")]),t._v(" "),s("td",[t._v("/dist")]),t._v(" "),s("td",[t._v("no")]),t._v(" "),s("td")]),t._v(" "),s("tr",[s("td",[t._v("/")]),t._v(" "),s("td",[t._v("proxy_pass:http://localhost:300")]),t._v(" "),s("td",[t._v("/")]),t._v(" "),s("td",[t._v("/dist")]),t._v(" "),s("td",[t._v("/dist/assets/img.png")]),t._v(" "),s("td")]),t._v(" "),s("tr",[s("td",[t._v("/dist/")]),t._v(" "),s("td",[t._v("proxy_pass:http://localhost:300")]),t._v(" "),s("td",[t._v("no")]),t._v(" "),s("td",[t._v("/dist")]),t._v(" "),s("td",[t._v("/dist/assets/img.png")]),t._v(" "),s("td",[t._v("proxy_pass 后面内容无 / 写法正确时则将客户端原始 url 转发")])]),t._v(" "),s("tr",[s("td",[t._v("/dist/")]),t._v(" "),s("td",[t._v("proxy_pass:http://localhost:300/")]),t._v(" "),s("td",[t._v("/dist")]),t._v(" "),s("td",[t._v("/dist/dist")]),t._v(" "),s("td",[t._v("/dist/dist/assets/img.png")]),t._v(" "),s("td",[t._v("所以 proxy_pass 改成 :3000/dist/跟上一阿行同效果")])]),t._v(" "),s("tr",[s("td",[t._v("/")]),t._v(" "),s("td",[t._v("proxy_pass:http://localhost:300/dist")]),t._v(" "),s("td",[t._v("no")]),t._v(" "),s("td",[t._v("/")]),t._v(" "),s("td",[t._v("访问不到!!")]),t._v(" "),s("td",[t._v("客户端/dist 会被处理成/distdist 相当于根据 location 匹配后拼接")])]),t._v(" "),s("tr",[s("td",[t._v("/")]),t._v(" "),s("td",[t._v("proxy_pass:http://localhost:300/dist/")]),t._v(" "),s("td",[t._v("no")]),t._v(" "),s("td",[t._v("/")]),t._v(" "),s("td",[t._v("/assets/img.png")]),t._v(" "),s("td")]),t._v(" "),s("tr",[s("td",[t._v("/")]),t._v(" "),s("td",[t._v("alias:E:/test/")]),t._v(" "),s("td",[t._v("/")]),t._v(" "),s("td",[t._v("/dist")]),t._v(" "),s("td",[t._v("/dist/assets/img.png")]),t._v(" "),s("td")]),t._v(" "),s("tr",[s("td",[t._v("/dist/")]),t._v(" "),s("td",[t._v("alias:E:/test/")]),t._v(" "),s("td",[t._v("/dist")]),t._v(" "),s("td",[t._v("/dist/dist")]),t._v(" "),s("td",[t._v("/dist/dist/assets/img.png")]),t._v(" "),s("td",[t._v("alias 后面加上 dist 目录即可省掉后面 dist 前缀")])])])]),t._v(" "),s("h3",{attrs:{id:"location-规则"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#location-规则"}},[t._v("#")]),t._v(" location 规则")]),t._v(" "),s("ul",[s("li",[t._v('"=" 精准匹配, 必须完全相同才能匹配上, 匹配后停止后续匹配，直接执行该匹配'),s("div",{staticClass:"language-shell extra-class"},[s("pre",{pre:!0,attrs:{class:"language-shell"}},[s("code",[t._v("  location "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" /abc "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# do something 表示只有当请求的URI为“/abc”时才会匹配到这个location，其他的URI都不会匹配到。")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])])]),t._v(" "),s("li",[t._v("“^~” 前缀匹配 找到普通 uri 匹配度最高的那个 location 后，立即处理此请求，并不再进行正则匹配"),s("div",{staticClass:"language-shell extra-class"},[s("pre",{pre:!0,attrs:{class:"language-shell"}},[s("code",[t._v("  location ^~ /abc/ "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# do something  表示当请求的URI以“/abc”开头时，就匹配到这个location。如果有多个location都匹配到了同一个URI，那么nginx会选择最长的前缀匹配来处理请求。")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])])]),t._v(" "),s("li",[t._v("“~”，执行正则匹配，区分大小写 按顺序匹配，一旦匹配上即停止后续匹配")]),t._v(" "),s("li",[t._v("“~*”，执行正则匹配，忽略大小写 按顺序匹配，一旦匹配上即停止后续匹配")]),t._v(" "),s("li",[t._v("普通匹配 不加任何规则时，前缀匹配，继续更长前缀匹配和正则匹配。")])]),t._v(" "),s("h4",{attrs:{id:"匹配顺序"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#匹配顺序"}},[t._v("#")]),t._v(" 匹配顺序")]),t._v(" "),s("p",[t._v("在 nginx 中，location 指令的匹配顺序是按照精确匹配、前缀匹配、正则表达式匹配的顺序进行。也就是说，当有多个 location 都可以匹配到同一个 URI 时，会优先选择精确匹配，然后是前缀匹配，最后是正则表达式匹配。")]),t._v(" "),s("h3",{attrs:{id:"多-server-模块"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#多-server-模块"}},[t._v("#")]),t._v(" 多 server 模块")]),t._v(" "),s("ol",[s("li",[t._v("首先选择所有的字符串完全匹配的 server_name。（完全匹配）")]),t._v(" "),s("li",[t._v("选择通配符在前面的 server_name，如*.mumusir.com www.mumusir.com")]),t._v(" "),s("li",[t._v("选择通配符在后面的 server_name，如 mumusir.* mumusir.com mumusir.cn")]),t._v(" "),s("li",[t._v("最后选择使用正则表达式匹配的 server_name，如~^www.(.*).com$")]),t._v(" "),s("li",[t._v("如果全部都没有匹配到，那么将选择在 listen 配置项后加入[default_server]的 server 块")]),t._v(" "),s("li",[t._v("如果没写，那么就找到匹配 listen 端口的第一个 Server 块的配置文件 #如果通过 ip 访问，会直接到 5，判断是否有 default_server 的 server 块，就走 6")])]),t._v(" "),s("h3",{attrs:{id:"重定向"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#重定向"}},[t._v("#")]),t._v(" 重定向")]),t._v(" "),s("p",[t._v("return/rewrite关键字\nhttps://nginx.org/en/docs/http/ngx_http_rewrite_module.html")]),t._v(" "),s("h2",{attrs:{id:"example"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#example"}},[t._v("#")]),t._v(" Example")]),t._v(" "),s("h3",{attrs:{id:"代理-api-请求"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#代理-api-请求"}},[t._v("#")]),t._v(" 代理/api 请求")]),t._v(" "),s("div",{staticClass:"language-shell extra-class"},[s("pre",{pre:!0,attrs:{class:"language-shell"}},[s("code",[t._v("location /api/ "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  proxy_pass http://IP:Port/"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  proxy_connect_timeout 15s"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  proxy_send_timeout 15s"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  proxy_read_timeout 15s"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  proxy_set_header X-Real-IP "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$remote_addr")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  proxy_set_header X-Forwarded-For "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$proxy_add_x_forwarded_for")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  proxy_set_header X-Forwarded-Proto http"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h3",{attrs:{id:"一个-server-块托管多个前端项目"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#一个-server-块托管多个前端项目"}},[t._v("#")]),t._v(" 一个 server 块托管多个前端项目")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 资源路径 /new_home/books/index.html")]),t._v("\nlocation "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("books "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  root "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("new_home"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  try_files $uri $uri"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("books"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("index"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("html"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  index  index"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("html index"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("htm"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n")])])]),s("p",[t._v("或者直接设置 root 路径为多个项目资源的存放目录")]),t._v(" "),s("div",{staticClass:"language-shell extra-class"},[s("pre",{pre:!0,attrs:{class:"language-shell"}},[s("code",[t._v("root /var/www/aml"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\nindex index.html"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("h3",{attrs:{id:"项目文件目录与-locationpath-不一致"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#项目文件目录与-locationpath-不一致"}},[t._v("#")]),t._v(" 项目文件目录与 locationPath 不一致")]),t._v(" "),s("div",{staticClass:"language-shell extra-class"},[s("pre",{pre:!0,attrs:{class:"language-shell"}},[s("code",[t._v("  location /ems/ "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v("alias")]),t._v(" E:/test/dist/"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h3",{attrs:{id:"一个-server-块反向代理多个服务"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#一个-server-块反向代理多个服务"}},[t._v("#")]),t._v(" 一个 server 块反向代理多个服务")]),t._v(" "),s("ul",[s("li",[t._v("方案一: 通过 location 去区分不同服务主机, proxy_pass 使用末尾'/'的方式, 但是要求服务的所有资源带固定前缀 或者用的'./'相对路径加载资源")]),t._v(" "),s("li",[t._v("方案二: 使用虚拟主机功能")])]),t._v(" "),s("h3",{attrs:{id:"v2ray-配置"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#v2ray-配置"}},[t._v("#")]),t._v(" v2ray 配置")]),t._v(" "),s("div",{staticClass:"language-shell extra-class"},[s("pre",{pre:!0,attrs:{class:"language-shell"}},[s("code",[t._v("location ^~ /ray "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 与 V2Ray 配置中的 path 保持一致")]),t._v("\n    proxy_redirect off"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    proxy_pass http://127.0.0.1:10000"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("#假设WebSocket监听在环回地址的10000端口上")]),t._v("\n    proxy_http_version "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1.1")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    proxy_set_header Upgrade "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$http_upgrade")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    proxy_set_header Connection "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"upgrade"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    proxy_set_header Host "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$http_host")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# Show realip in v2ray access.log")]),t._v("\n    proxy_set_header X-Real-IP "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$remote_addr")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    proxy_set_header X-Forwarded-For "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$proxy_add_x_forwarded_for")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"log"')]),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"loglevel"')]),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"warning"')]),t._v(",\n    "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"access"')]),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/var/log/v2ray/access.log"')]),t._v(",\n    "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"error"')]),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/var/log/v2ray/error.log"')]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(",\n\n  "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"inbounds"')]),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"port"')]),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("10000")]),t._v(",\n      "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"listen"')]),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"127.0.0.1"')]),t._v(",\n      "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"protocol"')]),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"vmess"')]),t._v(",\n      "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"settings"')]),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"clients"')]),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n          "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"id"')]),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"b831381d-6384-4d53-ad4f"')]),t._v(",\n            "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"alterId"')]),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),t._v("\n          "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(",\n      "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"streamSettings"')]),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"network"')]),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"ws"')]),t._v(",\n        "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"wsSettings"')]),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n          "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"path"')]),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/ray"')]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(",\n  "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"outbounds"')]),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"protocol"')]),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"freedom"')]),t._v(",\n      "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"settings"')]),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n")])])]),s("h3",{attrs:{id:"图片静态资源缓存"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#图片静态资源缓存"}},[t._v("#")]),t._v(" 图片静态资源缓存")]),t._v(" "),s("p",[t._v("每次前端打包拷贝到服务器上都会是新的文件, nginx 默认使用文件修改时间和大小生成 ETag, 如果想用文件内容的散列值生成 ETag, 可以使用 etag_hash 指令来进行配置, 所以想要缓存还是用强缓存")]),t._v(" "),s("p",[t._v("在设置缓存的同时"),s("code",[t._v("注意 NGINX location 的匹配顺序")])]),t._v(" "),s("div",{staticClass:"language-shell extra-class"},[s("pre",{pre:!0,attrs:{class:"language-shell"}},[s("code",[t._v("  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("#静态资料目录")]),t._v("\n  location ~* "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("."),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("gif"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),t._v("jpg"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),t._v("jpeg"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),t._v("bmp"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),t._v("png"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),t._v("ico"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),t._v("txt"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),t._v("css"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("$\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n     expires  30d"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n")])])])])}),[],!1,null,null,null);s.default=e.exports}}]);