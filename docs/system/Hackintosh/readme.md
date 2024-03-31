# Hackintosh

折腾系列

## 硬件

| 设备 | 型号                 |
| ---- | -------------------- |
| 主板 | 华硕 H61m-e          |
| CPU  | G1620                |
| 独显 | AMD Hd5450           |
| 声卡 | Realtek ALC887       |
| 网卡 | Realtek RTL8168/8111 |

## 工具

### BIOS

### 虚拟机 Vmware

安装 auto-unlocker 破解 VMware 使得支持 Mac 系统安装
ESXI -》 github 搜索 esxi-unlocker3.0.1 版本
需要 cdr 镜像(很难找，目前存放阿里云盘中)

### 镜像

- [黑果小兵](https://mirrors.dtops.cc/ISO/MacOS) 

地址好像换了： 

https://mirrors.dtops.co/ISO/MacOS/11/macOS%20Big%20Sur%2011.1%2020C69%20Installer%20for%20CLOVER%205127%20and%20WEPE.dmg

dmg 文件直接使用 etcher 刻录到 U 盘，
认真阅读网站信息

### 刻录

[etcher](https://www.balena.io/etcher/)

### Clover

https://blog.daliansky.net/clover-user-manual.html

> 注意三方系统的启动参数，是否金禁用 alc 等驱动进行启动的

### kexts

- VirtualSMC 模拟苹果的 msc, 必须
- RealtekRTL8111 网卡(螃蟹卡)
- WhatEverGreen 显卡补丁
- USBinjectALL usb 驱动

## 安装

- 安装步骤：https://github.com/Lubibest/How-to-install-a-Hackintosh
- 启动参数去掉 alcoff
- 安装完成后续 https://www.mfpud.com/topics/1177/

### ATI Radeon Hd5450

显卡驱动： https://blog.csdn.net/wr132/article/details/54837303 / https://www.tonymacx86.com/threads/guide-enabling-ati-radeon-hd-5450.180817/
声卡驱动： 删除 FakePcIIDIntel_HDMI_AUDIT 和 VoodooHDA.kext , clover-> 设备设置 audio 填写 11

## Mac 软件

- Intel power Gadget
- clover configurator

## OpenCore

官方文档： https://github.com/dortania/OpenCore-Install-Guide
国光的黑苹果 OC 教程 https://apple.sqlsec.com/
clover 过度到 oc: https://github.com/dortania/OpenCore-Install-Guide/blob/master/clover-conversion/Clover-config.md#graphics
显卡伪冒设备 Id : https://dortania.github.io/Getting-Started-With-ACPI/Universal/spoof.html

ATI hd5450 => deviceId: 68E0 vendor ID: 1002(ATI 显卡都是这个代码)

## docker 安装 Macos

https://hub.docker.com/r/sickcodes/docker-osx

## 用脚本安装 MACOSX

https://github.com/luchina-gabriel/OSX-PROXMOX

1. 在 pve 中执行 /bin/bash -c "$(curl -fsSL https://install.osx-proxmox.com)"
2. pve 会自动重启, 后屏幕卡在 loading initial ramdisk 是正常的，web interface 能正常使用
3. osx-setup

具体操作步骤 https://blog.wubw.fun/2023/12/pve-8-hacintosh-sonoma.html

## OSX-KVM

虚拟机安装 osx 解决方案, 用他的脚本生成 macos recovery 镜像然后到 pve 中新建虚拟机,恢复Macos
