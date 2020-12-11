#! /bin/bash
# date:  2020年7月6日20:33:07
# author：wangjj

# function： 编写hello world脚本
echo "Hello World"
echo -e  "Hello World,echo -e输出转义字符或者输出带颜色字体 \n"
echo "\"Hello World\""   #使用\转义字符
echo '我是单引号包裹的字符${PATH} 你看我没有输出环境变量，\" 你看我也没有转义字符'
echo "我是双引号包裹的${PATH}"
echo "使用$ () 执行命令：$(date) "
echo "使用反引号执行命令"`date`
