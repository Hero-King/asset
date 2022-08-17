# !/bin/bash
# 获取ESXI的ipv6地址脚本
PATH=/etc:/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin
export PATH
sshpass -p "密码" ssh 192.168.1.2 esxcli network ip interface ipv6 address list | grep 2409