#! /bin/bash
# date 2020年10月12日23:10:26
# author：wangjj

# function：学习date命令

# data 显示时间
echo "
%Y 显示年 2020
%m 显示月 01
%d 显示日 07
%F 显示年月日
%H 显示小时 24小时制 （00~23）
%M 显示分钟 （00~59）
%S 显示分秒（00~59）
%w 显示周 （0~6）
%s 显示1月1号 至今 多少秒
%T 显示时间 时:分:秒 
"
backFileName=$(date +%Y%m%d)
echo "查看帮助文档"
# tar -zcvf ${backFileName}.tar.gz /var/spool/cron/

