# FnOS

## 相关优化设置
```shell
# 关闭miniscreen
systemctl disable trim_wayland.service; systemctl disable trim_miniscreen.service

# vim /etc/default/grub

# 查看错误日志
journalctl -p err
```

## webhooks实现容器重新部署

