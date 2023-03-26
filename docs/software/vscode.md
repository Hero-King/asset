# Vscode 使用

## vscode 插件

已使用 vscode 账号进行多设备同步

- eslint
- Auto close tag
- Auto rename tag
- conventional commits
- git history
- gitlens
- es6 code snippets
- live Server
- remote ssh
- todo tree
- vue-helper
- vetur
- prettier 代码格式化插件 <a href="https://www.prettier.cn/docs/options.html">配置参考</a>
  1. semi(semicolons) 末尾是否添加分号
  2. tabWidth tab 对应的空格数
  3. singleQuote 是否使用单引号
  4. jsxSingleQuote jsx 中是否使用单引号
  5. bracketSpacing 在括号内是否保留空格 { foo: bar }
  6. bracketSameLine 组件> 符号和组件内容是否一行显示
  7. arrowParens 箭头函数一个参数时是否使用括号包裹
  8. filepath
  9. trailingComma 行尾逗号,默认 none,可选 none|es5|all

## win7 安装 ssh 客户端

https://www.mls-software.com/opensshd.html

> win10 已经自带 ssh 客户端、服务端程序

## ~~修改终端为 git bash~~

~~vscode -> 设置 -> 搜索 shell:window(找到 terminal>integrated>SHell:window) > 打开 JSON 配置文件  
修改 terminal.integration.shell.windows 改为 Git 的 bash.exe 绝对路径~~

`win10不在需要使用git bash, powershell已经比较不错了`

## 使用 remote-ssh 插件实现云开发

你是否还在为重装系统、换用其他 OS 而需要重装 IDE，插件等而烦恼，现在使用 remote-ssh 就可以实现在 linux 远程开发 vacode-server 占用内存 400M 左右

## 使用步骤

- 安装具有 ssh 功能的模块，windows7 推荐使用 git win10 自带 openssh 客户端，在 vscode 中设置默认的终端是 git
- 安装 remote-ssh 插件并保存连接，输入密码
- linux 云主机安装 vscode-server，之前的连接会在/root/.vscode-server 生成目录，这里要讲一下，如果是有网环境，bin/${vscode-server git 版本的 commitId}/目录下面会自动下载好适配本地 vscode 版本的 vscode-server，如果没有，则手动下载解压到当前目录 参考：https://www.cnblogs.com/litaozijin/p/13202992.html
- 如果 vscode 版本大于 1.64 vscode 加入了“接受条约”的要求，强制要求用户需要去阅读确认后手动修改以表明接受其声明, 需要`vim ~/.vscode-server/bin/${hash}/server.sh` 追加`--accept-server-license-terms`参数
- 至此可以正常连接使用了，可以配置秘钥免密码登陆，插件需要把本地插件安装到 ssh 中

### ssh 连接走自己的代理服务器

使用 ProxyCommand 参数

> ssh -o ProxyCommand=' 连接代理服务器命令 ' ssh 服务器
> 或者使用.ssh/config 客户端配置 不需要再手动再 ssh 命令后添加参数
> 因为 git bash 和 windows cmd 环境不同 连接命令使用绝对路径!!(比如 git bash 中使用 ssh heroking 可以成功 ssh www.heroking.top就错误 windows10 cmd 就相反)
> Host www.heroking.top
> HostName www.heroking.top
> User root
> ForwardAgent yes
> ProxyCommand C:\Users\SV00249433\AppData\Local\Programs\Git\mingw64\bin\connect.exe -S 127.0.0.1:10808 -a none %h %p
> Host heroking
> HostName www.heroking.top
> User root
> ForwardAgent yes
> ProxyCommand connect -S 127.0.0.1:10808 -a none %h %p

## Vue create uniapp 环境拉去模板太慢问题

git clone https://github.com/dcloudio/uni-preset-vue.git
vue create -p E:\workspace\DEMO\uni-preset-vue my-project
下载 Hello 模板又很慢

> 使用 4G 移动网络下载

## 云端 vscode

服务器安装 code-server 软件 修改配置 通过 Nginx 转发请求到本地 10000 端口中

```txt
# path: ~/.config/code-server/config.yaml
bind-addr: 127.0.0.1:10000
auth: password
password: xxx
cert: false
```
