# cron 定时任务

> https://www.cnblogs.com/zhoul/p/9931664.html  
> 在 linux 下，如果想要在未来的某个时刻执行某个任务，并且在未来的每一个这样的时刻里都要执行这个任务。举个简单的例子，比如说想要在将来，
> 每天的十二点都重启路由器，大多数发行版都自带一个守护进程（daemon）cron 来完成这项工作。这篇文章主要介绍了在 linux 上定期执行命令、脚本
> （cron，crontab，anacron）的相关知识

## cron，crontab 以及 anacron 的关系

cron 是大多数 linux 发行版都自带的守护进程（daemon），用来重复运行某些被设定好了确定的运行时间的任务，这些任务可以是每个月运行、每周运行、每天运行，
甚至是每一分钟运行。用 cron 执行的任务适合于 24 小时运行的机器，cron 执行的任务会在设定好的时刻执行，当机器处于关机状态下并错过了任务执行的时间，
cron 任务就无法预期执行了。
crontab(cron table 的简称)既可以指 cron 用来定期执行特定任务所需要的列表文件，又可以指用来创建、删除、查看当前用户（或者指定用户）的 crontab 文件的命令。

anacron 不是守护进程，可以看做是 cron 守护进程的某种补充程序，anacron 是独立的 linux 程序，被 cron 守护进程或者其他开机脚本启动运行，可以每天、每周、
每个月周期性地执行一项任务（最小单位为天）。适合于可能经常会关机的机器，当机器重新开机 anacron 程序启动之后，
anacron 会检查 anacron 任务是否在合适的周期执行了，如果未执行则在 anacron 设定好的延迟时间之后只执行一次任务，而不管任务错过了几次周期。
举个例子，比如你设定了一个每周备份文件的任务，但是你的电脑因为你外出度假而处于关机状态四周，当你回到家中开机后，anacron 会在延迟一定时间之后只备份一次文件。由于发行版的不同，cron 守护进程如何运行 anacron 会有所不同。

## crontab 命令，crontab 文件语法

系统默认 crontab 文件为/etc/crontab,以及/etc/cron.d/目录下的文件，有些程序会把自己的 crontab 文件放在/etc/cron.d/目录下。
要修改/etc/crontab 以及/etc/cron.d/目录下的文件需要 root 权限。cron 守护进程会检查/etc/crontab 以及/etc/cron.d/目录下的文件，
根据这些文件中的 cron 任务所设置的执行时间决定是否执行任务，如果当前时间与 cron 任务所设置的执行时间相同，则执行任务。

每个用户自己的 crontab 文件都会被放在 /var/spool/cron 目录下，默认为空，可以使用 crontab 命令创建。
cron 守护进程会检查/var/spool/cron 目录下的文件，根据这些文件中的 cron 任务所设置的执行时间决定是否执行任务，
如果当前时间与 cron 任务所设置的执行时间相同，则执行任务。

当 cron 的配置文件发生改变时，不需要重置 cron 守护进程。cron 守护进程会检查配置文件的变化。

创建自己的 crontab 之前，首先要设置环境变量 EDITOR,cron 进程根据它来确定使用哪个编辑器编辑 crontab 文件。
在 home 目录下的.bashrc 或者.profile 里加入一行 #你也可以使用自己喜爱的其他终端编辑器
EDITOR=vim; export EDITOR

使用 crontab -h 查看帮助
当用 crontab -e **编辑当前用户的 crontab 文件时，首先写入以下内容**。
1 # crontab -e
2 SHELL=/bin/bash
3 MAILTO=root@example.com
4 PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin
5
6 # For details see man 4 crontabs
7
8 # Example of job definition:
9 # .---------------- minute (0 - 59)
10 # | .------------- hour (0 - 23)
11 # | | .---------- day of month (1 - 31)
12 # | | | .------- month (1 - 12) OR jan,feb,mar,apr ...
13 # | | | | .---- day of week (0 - 6) (Sunday=0 or 7) OR sun,mon,tue,wed,thu,fri,sat
14 # | | | | |
15 # \* \* \* \* \* user-name command to be executed

该文件的前三行代码设置了默认环境。cron 守护进程并不提供任何环境。SHELL 变量设置当 cron 任务(命令以及脚本)运行时的 shell,
MAILTO 变量设置 cron 任务执行结果发送的邮箱，PATH 设置去哪些目录下寻找 cron 任务的命令。
注释部分则解释一条 cron 任务的构成，一条 cron 任务就是一行，要设置多少条 cron 任务则写多少行。一条 cron 任务由七个部分组成，从左到右依次为：

分钟（0-59）
小时（0-23）
天（1-31）
月 （1-12）：或者可以使用月份的英文单词的前三个字母，比如 jan,feb,mar,apr...
星期（0-6）：星期天用 0 或者 7 都可以，或者可以使用星期的英文单词的前三个字母，比如 sun,mon,tue,wed,thu,fri,sat
用户名称（可以省略）
要执行的命令或者脚本目录
前五个部分的编写注意特殊符号的含义：

如果你想匹配取值范围内的所有值，使用“_”
想匹配某些特殊的值，使用“,”，比如 2,4,7 就匹配的是 2，4 以及 7。
两个值被“-”连接表示范围，此时匹配的是范围内所有值，包含“-”两边的值，比如 4-7 匹配的就是从 4 到 7。
想要表达每隔一段时间执行一次任务，使用 “/”， 比如分钟部分中的 “_/10”表示每 10 分钟运行一次，比如小时部分中的“10-22/2”则表示在早上 10 点到晚上 10 点这段时间内，每隔两个小时运行一次。 注意 ：当“/”左边的值可以除尽“/”右边的值时，任务才会运行。

举例：
每天凌晨执行
0 0 \* \* \* root command

每周星期天早上五点执行
0 5 \* \* sun root command

每个月的前 10 天晚上 10 点开始每隔 10 分钟执行一次命令
_/10 22 1-10 _ \* root command

从星期一到五，每个小时的第 10 分钟、第 20 分钟以及第 30 分钟都执行一次命令
10,20,30 \* \* \* 1-5 root command

特殊简便写法：
@hourly 代表 0 \* \* \* _ ，每个小时运行一次
@daily 代表 0 0 _ \* _ ，每天凌晨运行一次
@weekly 代表 0 0 _ _ 0 ，每周星期天凌晨运行一次
@monthly 代表 0 0 1 _ _ ，每个月第一天凌晨运行一次
@yearly 代表 0 0 1 1 _ ，每年的头一分钟运行一次
@reboot 重启后执行一次

你可以把需要每个小时运行一次的脚本放到/etc/cron.hourly 目录下，cron 守护进程会每个小时都运行一次。
当然/etc 下面还有 cron.daily/ cron.hourly/ cron.monthly/ weekly/

## 限制可以使用 cron 的用户

在/etc/目录下，可能默认会有 cron.allow 以及 cron.deny 文件，也可能没有，没有的情况下可以自己创建，cron.allow 文件包含了可以使用 cron 的用户名，cron.deny 文件包含了不可以使用 cron 的用户名。两个文件中每个用户名占一行，并且不允许出现空格。

root 用户在任何情况下都可以使用 cron。

假如 cron.allow 存在，则只有列在这个文件中的用户名可以使用 cron,这时候 cron.deny 被忽视。

假如 cron.allow 不存在，则列在 cron.deny 文件中的用户名不可以使用 cron。

## 用 anacron 执行周期性的任务

anacron 程序可以周期性的执行任务，但具体执行时间并不确定。可以每天、每周、每个月周期性的执行任务。当 anacron 的配置文件发生改变时，下一次 anacron 运行时会检查到配置文件的变化。anacron 的配置文件为/etc/anacrontab,编辑需要 root 权限，默认以下内容：

```
# See anacron(8) and anacrontab(5) for details.
SHELL=/bin/sh
PATH=/sbin:/bin:/usr/sbin:/usr/bin
MAILTO=root
# the maximal random delay added to the base delay of the jobs
RANDOM_DELAY=45
# the jobs will be started during the following hours only
START_HOURS_RANGE=3-22
#period in days delay in minutes job-identifier command
1  5  cron.daily    nice run-parts /etc/cron.daily
7  25  cron.weekly    nice run-parts /etc/cron.weekly
@monthly 45  cron.monthly   nice run-parts /etc/cron.monthly
可以看到前三行设置了默认环境，RANDOM_DELAY变量设置了最大延迟执行时间，START_HOURS_RANGE变量设置了anacron任务执行的时间范围，默认在每天的3点到22点之间。最后三行则设置了三条默认的anacron任务，分别是每天执行，每周执行，每月执行。
```

### anacron 文件语法

观察前面三条默认的 anacron 任务，可以看到一条 anacron 任务分为四个部分，从左到右依次为：

周期（天）：设置任务执行的频率，以 天数 为单位，写 1 则代表每天执行，写 3 则代表每 3 天执行，可以使用特殊符号“@”， @daily 代表每天， @weekly 代表每周， @monthly 代表每月。
延迟时间：设置任务的延迟时间，以 分钟 为单位，比如写 5，则当 anacron 启动后，anacron 等待 5 分钟就会执行该任务。设置延迟时间是为了当机器启动时不会因为执行很多 anacron 任务而过载。
任务标识：其目的是识别消息，日志文件和执行特殊操作。
要执行的命令
在/etc/anacrontab 中的三条默认 anacron 任务中，nice 命令用来调整后面命令的优先级，run-parts 命令用来执行设置的目录下的所有脚本，就是说这三条任务分别每天，每周，每月执行/etc/cron.daily，/etc/cron.weekly，/etc/cron.monthly 目录下的脚本。所以我们不用自己往/etc/anacrontab 中添加 anacrontab 任务，而只需把脚本放到相应的目录下，anacron 就会周期性的执行这些脚本了。

### 3.2.anacron 如何运行

既然 anacron 不是守护进程，那它是如何做到周期性执行任务的呢？在 centos7 下，cron 会运行/etc/cron.d/0hourly，在/etc/cron.d/0hourly 文件里，
有一条 cron 任务是这样的：
01 \* \* \* \* root run-parts /etc/cron.hourly
这条 cron 任务会运行/etc/cron.hourly 目录下的所有脚本，其中有一个名为 0anacron 的脚本，该脚本则会在合适的时间运行 anacron,
anacron 则会检查/etc/anacrontab,在合适的时间分别运行/etc/cron.daily，/etc/cron.weekly，/etc/cron.monthly 目录下的脚本。

系统建立的时间任务配置文件：
vim /etc/crontab 记录“系统中”默认定义的一些计划任务。
SHELL=/bin/bash
PATH=/sbin:/bin:/usr/sbin:/usr/bin
MAILTO=root
HOME=/

## run-parts

01 \* \* \* _ root run-parts /etc/cron.hourly
02 4 _ \* _ root run-parts /etc/cron.daily
22 4 _ _ 0 root run-parts /etc/cron.weekly
42 4 1 _ \* root run-parts /etc/cron.monthly

- - - - - root /bin/echo "111111111" > /dev/pts/0 （直接写命令）
- - - - - root /test/dir1/test.sh （运行单个脚本）
- - - - - root run-parts /test/dir1 （运行目录下的所有可执行程序）

注意，写在这里的时间任务必须指明 运行该命令的用户身份
一般都是 root
run-parts:可以执行某个目录下的所有脚本文件

> Linux 进行工作排程的种类有两种，
> at 是执行突发性的 乐意处理并执行一次就结束的，依赖于 atd 这个服务
> crontab 这个指令是周期性的 也可以编辑文件
> Linux 中有很多的周期性工作要做的 比如周期更新 locate 数据库，文件位于/var/lib/mlocate

    比如RPM登陆文件的建立

At 设置好的定时任务 可以通过 atq 查询，通过 atrm 删除
