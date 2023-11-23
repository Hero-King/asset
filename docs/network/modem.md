# 光猫

## 桥接

1. 取消 hdcp 使能或者关闭 dhcp 服务器
2. 记录好 Internet 连接和 iptv 连接 vlanid
3. internet 业务改成桥接

## vlan 绑定

选择好连接和绑定的某个端口, 输入用户侧 vlanid(写法是出口 vlanid/上层业务 vlanid); 然后在路由器上使用对应的 vlanid 接受数据
`vlan绑定端口1后系统会自动取消网络连接中的业务到端口1的绑定`

## 光猫交换机功能(省掉弱电箱中的交换机)

将光猫不需要的几个端口绑定到一起, 主路由有线回程到某一个不需要的端口

## 单臂路由

光猫 Internet 业务取消所有端口绑定, (设置 lan1 口 vlan 绑定 不设置也正常运行)
只有一个网口时刷机 openwrt 系统, 默认只有一个 lan 口,只需要按照如下操作, 可以在 op 和光猫中间添加 ap 设备(华为路由器有问题, 可以使用老毛子;op 固件 ap 模式, 网线都插在 路由器的 Lan 口)提供无线的功能

- 关闭 lan 口的桥接
- 设置 lan 口物理设备 eth0
- 新建 wan 口物理设备 eth0 用于宽带拨号
- 与 openwrt 连接的设备关闭 dhcp 服务, op 的 dhcp 服务勾选强制

https://www.right.com.cn/forum/thread-5768047-1-1.html
https://www.right.com.cn/FORUM/thread-6196997-1-1.html
https://www.right.com.cn/forum/thread-4066357-1-1.html

## 资料

https://zhuanlan.zhihu.com/p/450698488

## 改用常规拓扑

- 光猫设置拨号上网 开启 upnp, 设置 dmz 主机为路由器
- 路由器接 WAN 口, 设置 静态 ip: 2.1, lan 子网设置 2.x 网段, 设置 dmz 主机 2.3, 开启ddns
- pve 静态 ip 2.2, op 系统设置 ip: 2.3
