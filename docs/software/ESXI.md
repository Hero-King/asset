### ESXi 安装使用

内网穿透:
映射端口 443tcp 可以网页访问 需要使用 vmware 客户端访问图形界面映射 tcp902

#### 什么是 vsphere?

VMware 的产品,是直接安装在裸机上面,然后在其 OS 基础上面去安装虚拟机; 有 C/S 架构和 B/S 架构

和 VMware vsphere 其他产品的区别可以参考这里 https://zhuanlan.zhihu.com/p/69214067

vmware view 是桌面虚拟化产品

vcloud vsphere view

虚拟化战役还有:

| 产品\公司    | Citrix(思捷)   | Microsoft | redhat                   |
| ------------ | -------------- | --------- | ------------------------ |
| 服务器虚拟化 | XenServer      | Hyper-v   | KVM                      |
| 桌面云虚拟化 | XenDesktop(牛) | VDI       | KVM (也可以跑桌面虚拟化) |
| 应用虚拟化   | XenAPP         | App-V     |                          |
| 云计算       | CloudStack     |           | OPenStack                |

Vsphere 是数据中心级别的虚拟化产品; 其他 vmware 虚拟化产品的基石 云计算的分支基础之一

Vsphere 实现方式 : 将企业的服务器 存储 网格 变成资源池!! 用什么就来拿什么

vsphere 有两个核心 ESXi 服务器和 vCenter Server . ESXi 是 hypervsior,运行在逻裸机上面的操作系统，您可以在其中创建和运行虚拟机和虚拟设备,有大概三个版本; 不同价格不同版本不同功能。vCenter Server 是用于管理网络中连接的多个 ESXi 主机和池主机资源的服务。我希望这个简单的信息能够从“什么是 VMware vSphere”这个问题中清除您的想法。与其他虚拟机管理程序（如 Microsoft Hyper-v 和 Citrix Xen Server）相比，VMware vSphere 是虚拟化行业的主人。

![传统架构和vsphere虚拟机架构区别](http://note.youdao.com/noteshare?id=b4cf83a0abac1357bc0dfc23fb78c3fb)

左边传统架构如果只消耗 20%资源,那么其他全部浪费了 而后面可以装 4 到 5 个这样的虚拟机达到资源利用最大化 补充: 超重量级的数据业务不可以虚拟化,其他很多情况都可以虚拟化

#### 什么是 VMware ESXi？

VMware ESXi 是 VMware 的裸机虚拟机管理程序。VMware ESXi 是以 ISO 形式提供的软件，可直接安装在物理硬件上，如 Windows 或 Linux 操作系统。ESXi 安装占用空间小，大小为 144 MB。甚至可以在 USB pendrive 上安装 ESXi。VMWare ESXi 允许您在其中创建多个虚拟机，以在单个物理硬件中运行多个操作系统，如 windows，linux，solaris，macOS 等。它使您能够在虚拟机之上运行工作负载，从而可以整合多个物理硬件，从而将工作负载运行到更少的物理硬件中。

在 vSphere 5 之前，vSphere 有 2 个虚拟机管理程序 ESX 和 ESXi。随着 vSphere 5.0 的发布，ESXi 是唯一的虚拟机管理程序。

#### 什么是 virtual machine

在 ESXI 上面去创建虚拟机,这时候虚拟机已经和底层硬件没有关联; 他的体现形式是文件夹(VM folder) 现在想移动机器,只要移动文件夹即可

里面主要包括:

- VMname.vmx 配置文件
- vswp Swap 文件
- .log
- .vmdk 磁盘文件

#### 安装 ESXI

可以安装到 U 盘 内存 硬盘 远程主机 启动加载进内存,安装在哪里不重要

前往下载 https://www.vmware.com/products/esxi-and-esx.html

ISO 镜像; 和安装 linux 系统相同步骤: 刻盘 (使用 USB-HDD+ v2 方式)BIOS 设置启动项 安装

但是驱动不起来 PC 机的网卡 当然大公司的服务器都是有定制镜像的

可以自己手动制作安装镜像(驱动网卡 RTL 8168 怎么查看网卡型号呢?? lspci 命令) 本人使用 ESXi-whsir-6.7.0-20181104001-r8168-standard-whsir-customized 网络上面集成好驱动的镜像

- BIOS 设置

  ```
  使用UEFI 启动方式
  开启UEFI
  设置安全启动为其他OS
  CSM设置成auto或者关闭(CSM关闭则说明只能UEFI启动,不支持传统方式)
  ```

- 如果提示网络问题,则说明网卡未驱动成功

- 密码设置注意复杂性

- 每次重启会覆盖之前的改动,如有需要可以百度参考其他文章; 我也很想在 esxi 中跑 DDNS 解决 IPv6 太长问题

Chrome 访问 esxi 的 IP 地址即可

```
ESXI安装aliddns脚本需要修改一些文件 ; 暂不考虑修改esxi
笔者在路由器上使用aliddns客户端
公网中通过域名访问路由器(SSH连接)  ping -6 server(ESXI主机名).lan(局域网域名)查看ESXI主机ipv6地址获取其公网ip
```

#### 安装 VirtualBox6.1

VirtualBox 几乎可以虚拟化主机的所有硬件

VirtualBox 支持在虚拟机中使用虚拟串行端口。

参考文档 https://www.linuxidc.com/Linux/2018-11/155220.htm

cd /etc/yum.repo.d && wget http://download.virtualbox.org/virtualbox/rpm/rhel/virtualbox.repo

yum search virtualbox 查看 安装某版本 virtual

systemctl status vboxdrv.service

```
Please install the Linux kernel header files
卸载kernel-devel 重装	http://mirror.centos.org/centos/7/os/x86_64/Packages/kernel-devel-3.10.0-1062.el7.x86_64.rpm
拓展包安装要注意版本    如果安装错了先卸载  vboxmanage extpack -h
```

#### virtualbox 常用命令

https://www.linuxidc.com/Linux/2012-01/51362.htm

https://www.cnblogs.com/luhouxiang/p/3275102.html

- vboxmanage createvm 创建虚拟机 --nam 指定 VM 名称 --ostype 指定安装操作系统类型 --register 注册

- vboxmanage startvm 开启虚拟机

- vboxmanage createhd --size

​ storagectl 创建 state 控制器

- （可选）为 VM 配置一些设置。

  - vboxmanage modifyvm VM 名 --boot 启动顺序 内存等

- 添加存储控制器(storage controller) vboxmanage storagectl

  ```
  VBoxManage storagectl       <uuid|vmname>
                              --name <name>
                              [--add ide|sata|scsi|floppy|sas|usb|pcie]
                              [--controller LSILogic|LSILogicSAS|BusLogic|
                                            IntelAhci|PIIX3|PIIX4|ICH6|I82078|
                                            USB|NVMe|VirtIO]  说明:  IDE, RAID, AHCI(sata模式)
                              [--portcount <1-30>]
                              [--hostiocache on|off]
                              [--bootable on|off]
                              [--rename <name>]
                              [--remove]
  ```

- 绑定控制器到存储介质 VBoxManage

VRDP 使用

默认 TCP 端口 3389 如果运行多个 VRDP 服务器，则需要更改默认端口，因为该端口一次只能由一台服务器使用

打开 vrde VBoxManage Modifyvm VM-name --vrde --vrdeport 指定端口

**VBoxManage showvminfo** 查看 VM 信息

使用 VBoxHeadless 启动虚拟机 这样虚拟机就不需要图形界面了

#### 安装虚拟机 winserver

https://www.virtualbox.org/manual/UserManual.html#startingvboxonlinux 7.1.3

```
官网例子:   老旧!! 不好用
VBoxManage createvm --name "WindowsServer" --ostype Windows2008_64 --register
不知道OStype有哪些 使用  vboxmanage list ostypes
VBoxManage modifyvm "WindowsServer" --memory 1000 --acpi on --boot1 dvd --nic1 nat  设置内存1G 开启ACPI 启动项dvd设置为第一 网络设置nat
VBoxManage Modifymedium --filename "WindowsServer.vdi" --size 10000  创建10G硬盘
VBoxManage storagectl "WindowsServer" --name "IDE Controller" --add ide --controller PIIX4 添加IDE控制器
VBoxManage storageattach "WindowsServer" --storagectl "IDE Controller" --port 0 --device 0 --type hdd --medium "WindowsServer.vdi"
VBoxManage storageattach "WindowsServer" --storagectl "IDE Controller" --port 0 --device 1 --type dvddrive --medium /dev/sr0 这里应该是ISO镜像文件路径
 VBoxManage modifyvm "WindowsServer" --vrde on
 VBoxHeadless --startvm "WindowsServer"
 一般虚拟化主ESXi都不会开启BIOS中的CPU虚拟化技术，INTEL叫VT-x，AMD的叫AMD-V。
 手动开启 在虚拟机设置中CPU里面开启 硬件虚拟化 向客户机操作系统公开硬件辅助的虚拟化
 删除虚拟机
 VBoxManage unregistervm  --delete WindowsServer


 ----------------------------------->
应该这么玩
https://blog.csdn.net/u013431916/article/details/80898084
1. 创建虚拟磁盘: VBoxManage createmedium
vboxmanage createmedium disk --filename WindowsServer.vdi --size 20480
vboxmanage list hdds  查看创建的虚拟磁盘
2.创建虚拟机:
VBoxManage createvm --name "WindowsServer" --ostype Windows2008_64 --register
3.创建SATS控制器:  (控制器有类型之分STAT IDE 然后有端口之分 一个端口又分设备)
vboxmanage storagectl WindowsServer --name "SATA Controller" --add sata --controller   IntelAHCI
4.关联控制器到虚拟磁盘
vboxmanage storageattach WindowsServer --storagectl "SATA Controller" --port 0 --device 0 --type hdd --medium WindowsServer.vdi
5.创建IDE控制器，设置为dvd，并将其与windowsServer的安装iso文件绑定：
vboxmanage storagectl WindowsServer --name "IDE Controller" --add ide
vboxmanage storageattach WindowsServer --storagectl "IDE Controller"  --port 1 --device 0 --type dvddrive --medium cn_windows_server_2008_r2_.iso
设置虚拟机内存 CPU 显存等
vboxmanage modifyvm WindowsServer --cpus 2 --memory 15000 --vram 16 --hwvirtex on
启动项
vboxmanage modifyvm WindowsServer --boot1 disk --boot2 dvd --boot3 none --boot4 none
无桌面开机
 vboxmanage startvm name --type=headless
```

#### 支持导入导出

文件格式是 ovf

### 安装 VMware

https://ubock.com/article/66 必看!!

```
yum -y install perl gcc kernel-devel libX11 libXinerama libXcursor libXtst  psmisc  gtk-update-icon-cache

问题: GLib does not have GSettings support
yum install -y  glib-devel glib2 glib2-devel glibc glibc-devel glibc-headers glibc-static glibc-utils  真正安装 glib-devel  glibc-static glibc-utils
还不行  yum install -y glib*


缺少gconftool-2 killall   gtk-update-icon-cache   update-desktop-database   /usr/bin/lsof
在安装 pcsc-lite-libs
虚拟机安装位置 默认是在/usr/lib/vmware
启动: 默认路径中包含 /usr/bin  vmware &
安装时候需要序列号!!
 ./VMware-Workstation-Full-15.5.2-15785246.x86_64.bundle --console --eulas-agreed --required -s vmware-workstation serialNumber YG5H2-ANZ0H-M8ERY-TXZZZ-YKRV8

ps -aux|grep vmware systemctl status vmware

卸载: vmware-installer -u vmware-workstation
虚拟机文件: .vmx 虚拟机设置主要配置文件 .log主要日志文件	.vmdk虚拟磁盘文件 (一个虚拟磁盘由一个或多个虚拟磁盘文件构成。) 虚拟机名称.vmsd  用于集中存储快照相关信息和元数据的文件。 Workstation Server 日志文件位置/var/log/vmware/hostd-n.log



使用 yum groupinstalll “Development Tools” 开发工具包装起来很容易




https://download3.vmware.com/software/wkst/file/VMware-Workstation-Full-15.5.2-15785246.x86_64.bundle


桥接模式: 虚拟机和裸机处于同一个网段  外面想ping进去注意先关闭防火墙(外部可以ping通)
nat模式 : 外网想要访问虚拟机服务需要 端口转发:  		     https://www.cnblogs.com/foreverlin/p/10163302.html
    具体操作是打开机器的网络编辑器  vmnet8 nat模式 去掉使用DHCP服务     nat设置中设置端口转发
```

### 安装 X11 支持（还是这个牛逼）

```
vim /etc/ssh/sshd_config 开启AllowTcpForwarding yes   X11DisplayOffset 10  [ X11UseLocalhost no   //网上很多说这里保持默认不需要修改 ]
安装X11依赖:
yum install -y xorg-x11-xauth           #安装x11组件包
yum -y install wqy-zenhei-fonts*        #安装中文字库
```

### 端口转发工具 rinetd

### Vcenter

集中管理多台装了 Esxi 的服务器, 是系统软件

### 磁盘

精简制备 用多少就占用磁盘多少大小
厚制备 直接占用磁盘指定的大小

### 网络

从底往上
显示硬件网卡 Vmware 可以看到设备 名称是 vmnic0 ... (一块网卡有一个或者多个接口(网口)) 这些网卡接口最终是和真实交换机端口物理网线连接
网卡上的接口在 vmware 中还叫上行链路(跟真实网络连接)
虚拟交换机可以连接一个或者多个上行链路 也可以不连接(则没有外网) 其实虚拟交换机连接多个上行链路就相当于的交换机有多个 wan 口上网

虚拟交换机跟虚拟机虚拟网卡连接的是 端口组 (用来划分流量的,就是把交换机的端口分组使用,方便管理/分流/负载均衡等) 统一端口组下面机器配置同一网段可互相通信 不同端口组下面机器使用相同 vlanID 可以通信

### 安装黑苹果

镜像格式：dmg 是 macos 系统的镜像格式，官方镜像就是这个格式（msdn 上面有苹果镜像了）但是 vmware 不识别这个镜像，需要转换成 cdr（mac 下的启动镜像）或者 iso 镜像（这两个一样的，可以直接改拓展名）

- 由于 vmware 的不能引导带 clover 的镜像，需要我们下载官方镜像制作自启动镜像 https://blog.sxbai.com/174.html 自己使用文中的.cdr 镜像（已经上传到个人 ESXI 中,发现不能识别 cdr 文件，嗨呀还是 vmware 上装好在打包吧）
- 由于 vmware 默认不支持 MACOS，需要使用 unlocker 破解软件，下载执行二进制文件即可
