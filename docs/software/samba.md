# Samba

## 安装

` yum install -y samba`

## 配置（参考/etc/samba/smb.conf.example）

- samba 服务器使用本机 linux 用户，但是密码是独立管理的，可以先创建 linux 用户或者使用已经存在的用户，设置登录密码`smbpasswd -a 用户名` 或者使用`pdbedit `

- 主要配置文件 /etc/samba/smb.conf，主配置文件由两部分构成，Global Settings（该设置都是与 Samba 服务整体运行环境有关的选项，它的设置项目是针对所有共享资源的。），Share Definitions（该设置针对的是共享目录个别的设置，只对当前的共享资源起作用。 ）

  - 常用的脚本文件案方面，若分为服务器与客户端功能，则主要有底下这几个数据：

    /usr/sbin/{smbd,nmbd}：服务器功能，就是最重要的权限管理 (smbd) 以及 NetBIOS name 查询 (nmbd) 两个重要的服务程序；

    /usr/bin/{tdbdump,tdbtool}：服务器功能，在 Samba 3.0
    以后的版本中，用户的账号与密码参数已经转为使用数据库了！Samba 使用的数据库名称为 TDB (Trivial DataBase)。
    既然是使用数据库，当然要使用数据库的控制指令来处理啰。tdbdump 可以察看数据库的内容，tdbtool 则可以进入数据库操作接口直接手动修改帐密参数。不过，你得要安装 tdb-tools 这个软件才行；

    /usr/bin/smbstatus：服务器功能，可以列出目前 Samba 的联机状况， 包括每一条 Samba 联机的 PID, 分享的资源，使用的用户来源等等，让你轻松管理 Samba 啦；

    /usr/bin/{smbpasswd,pdbedit}：服务器功能，在管理 Samba 的用户账号密码时， 早期是使用 smbpasswd 这个指令，不过因为后来使用 TDB 数据库了，因此建议使用新的 pdbedit 指令来管理用户数据；

    /usr/bin/testparm：服务器功能，这个指令主要在检验配置文件 smb.conf 的语法正确与否，当你编辑过 smb.conf
    时，请务必使用这个指令来检查一次，避免因为打字错误引起的困扰啊！

    /sbin/mount.cifs：客户端功能，在 Windows 上面我们可以设定『网络驱动器机』来连接到自己的主机上面。在 Linux 上面，我们则是透过 mount (mount.cifs) 来将远程主机分享的档案与目录挂载到自己的 Linux 主机上面哪！

    /usr/bin/smbclient：客户端功能，当你的 Linux 主机想要藉由『网络上的芳邻』的功能来查看别台计算机所分享出来的目录与装置时，就可以使用 smbclient 来查看啦！这个指令也可以使用在自己的 SAMBA 主机上面，用来查看是否设定成功哩！

    /usr/bin/nmblookup：客户端功能，有点类似 nslookup 啦！重点在查出 NetBIOS name 就是了

    /usr/bin/smbtree：客户端功能，这玩意就有点像 Windows
    系统的网络上的芳邻显示的结果，可以显示类似『靠近我的计算机』之类的数据， 能够查到工作组与计算机名称的树状目录分布图！

  - 全局配置

  - 共享目录配置（默认的几个选项，不用可以将注释掉，加入新的）

    - 默认的【Home】选项：共享登录用户的家目录/home/用户名

    - 自定义共享目录

      [MyShare]
      comment = Home xia de samba
      path = /home/\*\*\*/samba
      browseable = yes（未登录之前可以看到目录）
      writable = yes
      public = no（不允许匿名登录）
      valid users = 用户名

      ```

      # See smb.conf.example for a more detailed config file or
      # read the smb.conf manpage.
      # Run 'testparm' to verify the config is correct after
      # you modified it.

      [global]
              workgroup = WORKGROUP
              security = user

              passdb backend = tdbsam

              log file = /var/log/samba/log.%m
              # maximum size of 50KB per log file, then rotate:
              max log size = 50


              printing = cups
              printcap name = cups
              load printers = yes
              cups options = raw

      # 共享linux 家目录选项
      #[homes]
      #       comment = Home Directories
      #       valid users = %S, %D%w%S
      #       browseable = No
      #       read only = No
      #       inherit acls = Yes

      [MyShare]
              comment = Home xia de samba
              path = /home/wangjunjie/samba
              browseable = yes
              writable = yes
              public = no
              valid users = wangjunjie
      #

      ```

## 补充说明：

- windows 先要访问需要把 config 中群组设置成 WORKGROUP

- 测试服务可用性可以使用

  ```
  yum install -y samba-client
  smbclient //ip/myshare/ -U user1  # 其中myshare代表共享标志 配置文件中的[MyShare] [homes]

  ```

  - win7 清除访问 samba 局域网密码缓存`control userpasswords2 ` 然后【高级】/【密码管理】，删掉保存的该机器密码。

  - 防火墙开启 139 445

  - 查看 samba 服务器中已拥有哪些用户：`pdbedit -L`

  - 删除 samba 服务中的某个用户: `smbpasswd -x   用户名`

  - 共享目录最好设置权限 777

  - 可以使用 docker 部署该服务器，方便但是内存占用高；并不推荐

  - 参考博客

    - https://blog.csdn.net/weixin_40806910/article/details/81917077
    - https://blog.csdn.net/qq_38410730/article/details/80500920
    - https://www.linuxidc.com/Linux/2018-11/155466.html
