# 磁盘分区工具 gdisk创建磁盘gpt分区,fdisk创建mbr(传统的dos分区)
echo "查看当前磁盘分区信息 fdisk -L:"
fdisk -l 
echo "开始给磁盘分区"
echo "lsblk -f/df -T 查看当前硬盘设备和文件系统"
echo "gdisk /dev/sdb 注意 是给某块硬盘写入分区表"
echo "常用参数 p 打印分区信息; n创建新分区时候使用+10G 这种写法设置分区大小 w写入执行"

echo "partprobe -s 内核重新加载硬盘分区"
echo "开始某块分区格式化文件系统 mkfs/mkfs.efi/mkfs.ext4 /dev/sdb1 "

echo "mount 即可"

