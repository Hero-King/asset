# Autojs

## 环境搭建

安装软件和 vscode 插件

## 投屏软件

开源的 scrcpy github 上下载 或者 https://gitcode.net/mirrors/Genymobile/scrcpy/-/tree/master
手机需要开启 usb 调试和 use 安全设置 然后重启手机

## ts

输出的文件需要手动改动 所以不推荐使用 ts

1. npm i @autojs/types-pro9 -D

2. tsconfig 配置 typeRoots : ["./node_modules/@types","./node_modules/@autojs"]

3. 使用

```ts
import * as app from 'app'
app.launch('com.tencent.mm')
```

## API

### Selector

#### 返回 selector

- classname
- text
- id

#### 返回 UiObject

- findOne() 查不到会阻塞
- findOne(timeout)
- findOnce() 对屏幕上的控件进行搜索，如果找到符合条件的控件则返回该控件；否则返回 null。

#### 返回 UiCollection

- filter(f)

### Object

- children()
- childCount()
- child(i)
- parent()
- text()
- findByText(str) 根据文本 text 在子控件中递归地寻找并返回文本或描述(desc)包含这段文本 str 的控件，返回它们组成的集合。
- findOne(selector) 根据选择器 selector 在该控件的子控件、孙控件...中搜索符合该选择器条件的控件，并返回找到的第一个控件 返回 UiOobject
- find(selector) 根据选择器 selector 在该控件的子控件、孙控件...中搜索符合该选择器条件的控件，并返回它们组合的集合。

### UiCollection

- find(selector) 根据 selector 所确定的条件在该控件集合的控件、子控件、孙控件...中找到所有符合条件的控件并返回找到的控件集合。
- findOne(selector) 根据选择器 selector 在该控件集合的控件的子控件、孙控件...中搜索符合该选择器条件的控件，并返回找到的第一个控件
