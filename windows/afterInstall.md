# win10 系统

## 系统选择

win10 lstc 长期稳定精简版本

## 系统设置

### 系统激活

```shell
# 设置kms服务器
slmgr /skms 192.168.123.1
# 自动激活
slmgr /ato
```

### 桌面图标

在“主题”页面的右侧，找到“相关设置”，然后点击“相关设置”下面的“桌面图标设置”

### 关闭自动更新

打开服务（win+r services.msc ）关闭 windows update 服务 中

### 关闭小娜

运行窗口中输入【gpedit.msc】，回车进入组策略编辑器，依次点击计算机配置-管理模板-Windows 组件-搜索，找到【允许使用 Cortana】，勾选【已禁用】。

### 关闭 windows search

services.msc 在服务界面找到 Windows Search 这个选项，双击打开，将【启动类型】设置为【禁用】，点击【确定】即可。

### wsappx 占用资源过高的问题

https://zhuanlan.zhihu.com/p/523126699

### vscode 1.71.2

https://code.visualstudio.com/updates/v1_71 使用 github 账号同步设置

### 安装 chocolatey 包管理器

## npm 设置
安装nvm 管理nodejs版本
nvm install v16.14.2

### 更换淘宝源

```shell
npm config set registry https://registry.npm.taobao.org/
```

### 调整缓存位置

创建如下目录， 然后执行如下配置

```shell
npm config set prefix “D:\nodejs\node_global”
npm config set cache “D:\nodejs\node_cache”
```

### yarn 设置

https://www.jianshu.com/p/30ba1da2bde1

## Java

选用OracleJDK 1.8LTS版本

镜像站点
- https://www.injdk.cn/
- https://repo.huaweicloud.com/java/jdk/ 

下载地址: https://www.injdk.cn/  
windows: https://d6.injdk.cn/oraclejdk/8/jdk-8u341-windows-x64.exe   
aarch64: https://d6.injdk.cn/oraclejdk/8/jdk-8u341-linux-aarch64.tar.gz  安装到/usr/lib/jvm中
```shell
# /etc/profile中添加
# java path
export JAVA_HOME=/usr/lib/jvm/jdk1.8.0_341
export PATH=$JAVA_HOME/bin:$PATH
export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
```

## maven
apache-maven-3.8.7

windows: https://repo.huaweicloud.com/apache/maven/maven-3/3.8.7/binaries/apache-maven-3.8.7-bin.zip

linux: https://repo.huaweicloud.com/apache/maven/maven-3/3.8.7/binaries/apache-maven-3.8.7-bin.tar.gz 安装到/usr/local/中

### 配置
修改配置文件conf/settings.xml
- 本地仓库位置修改
```xml
<localRepository>D:\softwarefile\mavenrepository</localRepository>
```

- 修改maven默认的JDK版本
```xml
<profile>     
  <id>JDK-1.8</id>       
  <activation>       
    <activeByDefault>true</activeByDefault>       
    <jdk>1.8</jdk>       
  </activation>       
  <properties>       
    <maven.compiler.source>1.8</maven.compiler.source>       
    <maven.compiler.target>1.8</maven.compiler.target>       
    <maven.compiler.compilerVersion>1.8</maven.compiler.compilerVersion>       
  </properties>       
</profile>
```

- 配置镜像
```xml
<!-- 阿里云仓库 -->
<mirror>
    <id>alimaven</id>
    <mirrorOf>central</mirrorOf>
    <name>aliyun maven</name>
    <url>http://maven.aliyun.com/nexus/content/repositories/central/</url>
</mirror>
```


## idea
官网下载 激活教程: https://www.pycharm6.com/idea.html