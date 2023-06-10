# 转义字符 \n 换行
print('hello\nworld')

# \\ 表示 \
print('hello\\world')

# \t 横向制表符
print('hello\tworld')

# word将hello覆盖
print('hello\rworld')

# 退格 将o删掉了
print('hello\bworld')

print('http://www.baidu.com')

print('It\'s me')

# 不希望转义生效 注意最后一个字符不能是\
print(r'hello\nworld')
