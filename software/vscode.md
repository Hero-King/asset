### win7安装ssh客户端
https://www.mls-software.com/opensshd.html

### 修改终端为git bash
vscode -> 设置 -> 搜索shell:window(找到terminal>integrated>SHell:window) > 打开JSON配置文件   
修改terminal.integration.shell.windows 改为Git的bash.exe绝对路径

### 使用remote-ssh插件实现云开发
你是否还在为重装系统、换用其他OS而需要重装IDE，插件等而烦恼，现在使用remote-ssh就可以实现在linux远程开发 vacode-server占用内存400M左右
#### 使用步骤
- 安装具有ssh功能的模块，windows7推荐使用git win10自带openssh客户端，在vscode中设置默认的终端是git
- 安装remote-ssh插件并保存连接，输入密码
- linux云主机安装vscode-server，之前的连接会在/root/.vscode-server生成目录，这里要讲一下，如果是有网环境，bin/${vscode-server git版本的commitId}/目录下面会自动下载好适配本地vscode版本的vscode-server，如果没有，则手动下载解压到当前目录 参考：https://www.cnblogs.com/litaozijin/p/13202992.html 
- 至此可以正常连接使用了，可以配置秘钥免密码登陆，插件需要把本地插件安装到ssh中

### ssh连接走自己的代理服务器
使用ProxyCommand参数 
> ssh -o ProxyCommand=' 连接代理服务器命令 ' ssh服务器
或者使用.ssh/config 客户端配置 不需要再手动再ssh命令后添加参数
> 因为git bash和 windows cmd环境不同 连接命令使用绝对路径!!(比如git bash中使用ssh heroking可以成功 ssh www.heroking.top就错误 windows10 cmd 就相反)
Host www.heroking.top
  HostName www.heroking.top
  User root
  ForwardAgent yes
  ProxyCommand C:\Users\SV00249433\AppData\Local\Programs\Git\mingw64\bin\connect.exe -S 127.0.0.1:10808 -a none %h %p
Host heroking
  HostName www.heroking.top
  User root
  ForwardAgent yes
  ProxyCommand connect -S 127.0.0.1:10808 -a none %h %p

### git bash
添加.bash_rc 中 alias vue="winpty vue.cmd"  解决git bash中上下箭头不能使用问题

### Vue create uniapp环境拉去模板太慢问题
git clone https://github.com/dcloudio/uni-preset-vue.git
vue create -p E:\workspace\DEMO\uni-preset-vue my-project
下载Hello 模板又很慢
> 使用4G移动网络下载



