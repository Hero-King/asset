# armbian

查看 myshell/install_apt.sh

## WOL

- 配置网卡wol开启 `ethtool -s eth0 wol g`
- 安装唤醒工具包 `apt install etherwake`
- 唤醒命令 `etherwake mac`
