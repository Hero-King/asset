# PVE

## 安装

华硕安装 8.0.2 系统卡死在 loading driver, 使用 7.4 安装成功
安装成功后访问 8006 端口管理

- 安装后处理源问题 参考 https://blog.csdn.net/u012374381/article/details/129914297
- 分区合并到同一个 参考 https://zhuanlan.zhihu.com/p/605741611
- 安装无线网卡驱动 (已不支持kernel5.15)

## 群晖

跟安装openwrt一样的步骤，只不过磁盘需要使用sata格式， 删除磁盘导入github下载的arpl 选择model: 918, build Number: 42962, gender SerialNum => build loader, 等待一分钟访问ip:5000即可， 上传pat文件需要到跳转到群晖官网下载, 选择最新的操作系统版本，然后点击“所有下载”， 找到对应的buildNumber目录中>300Mb的系统镜像

> 安装矿神源