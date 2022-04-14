#! /bin/bash
# 监控内存和磁盘容量，小于给定值时报警
disk_size=$(df / | awk '/\// {print $4}')
mem_size=$(free | awk '/Mem/{print $4}')
echo ${disk_size}
echo ${mem_size}
if [ "${disk_size}" -le 512000 -a "${mem_size}" -le 512000 ]
then 
    echo "内存不足或硬盘空间不足"
else 
    echo "充足"
fi

