# PVE

## 安装

华硕安装 8.0.2 系统卡死在 loading driver, 使用 7.4 安装成功
安装成功后访问 8006 端口管理

- 安装后处理源问题 参考 https://wph.im/245.html
- 分区合并到同一个 参考 https://zhuanlan.zhihu.com/p/605741611
- 安装无线网卡驱动 (已不支持 kernel5.15)

## 群晖

### 安装

跟安装 openwrt 一样的步骤，只不过磁盘需要使用 sata 格式， 删除磁盘导入 github 下载的 arpl 选择 model: 918, build Number: 42962, gender SerialNum => build loader, 等待一分钟访问 ip:5000 即可， 上传 pat 文件需要到跳转到群晖官网下载, 选择最新的操作系统版本，然后点击“所有下载”， 找到对应的 buildNumber 目录中>300Mb 的系统镜像

> 安装矿神源

### ddns

连接性中 ddns 新增自定义供应商 Query URL：https://ddns.bkood.com/dns/quick/ali/default?ip=__MYIP__&hostname=__HOSTNAME__&ak=__USERNAME__&sk=__PASSWORD__

### ssl

安全性菜单证书中, 使用阿里签发的免费的 ssl 证书替换默认证书

### nginx 功能

登陆门户中 高级配置 nginx

## 资源管理

pve 使用的 noVnc 作为系统界面
资产网关 Apache Guacamole
