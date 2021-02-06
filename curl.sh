#! /bin/bash
# date :2021年2月6日10:11:23
# author： wangjj

# function: study curl

# http://www.ruanyifeng.com/blog/2011/09/curl.html
# https://www.ruanyifeng.com/blog/2019/09/curl-reference.html


# 它的功能非常强大，命令行参数多达几十种。如果熟练的话，完全可以取代 Postman 这一类的图形界面工具。
# 后台使用nginx 作为网站首页
# 发送get请求 nginx日志:  - - [06/Feb/2021:10:51:40 +0800] "GET / HTTP/1.1" 200 612 "-" "curl/7.52.1"
curl pan.heroking.top  

# get请求下载文件保存index.html  相当于wget
curl -o index.html pan.heroking.top

echo "curl 显示返回头信息 curl -i "
curl -i pan.heroking.top 

echo "curl post请求 参数可以使用-d"
curl -X post pan.heroking.top


