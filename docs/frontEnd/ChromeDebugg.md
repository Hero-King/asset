## Chrome 调试技巧

### 控制台

- $ document.querySelector 简写
- $$ document.querySelectorAll 简写
- $0 返回鼠标在 element Tab 页面中选中的 dom 元素
- $\_ 返回控制台上一次执行结果
- console.time("XXX") timeEnd("XXX") XXX tag 耗时
- console.dir console.table
- getEventListeners(DOM 元素) 获取 DOM 元素身上的事件 getEventListeners(window) 获取 window 上绑定的事件
- 切换Top上下文后，可以在控制台中访问切换后上下文的内容；变量
- 小眼睛：监听表达式的值

### Element

- 直接拖动元素
- h 快捷键 隐藏元素
- 使用 ctrl + 上下箭头 来移动元素!
- 选中 dom 元素 break on 设置断点 当元素被改变/删除等操作是 进入断点

### source

#### 代码栏右侧

- Watch 观察数据/表达式
- Call Stack 调用栈 可以查看哪个事件、方法走到当前断点
- BreakPoints 断点管理
- XHR/Fetch BreakPoints 设置 Ajax 请求断点 URL 包括某个字段进入断点
- Global Listeners 全局事件列表及注册点
- Event Listener BreakPoints 指定某个事件断点,当触发事件时, 会自动进入到事件响应函数中
- debugger时候可以在控制台中访问局部变量


### 快捷键

- ctrl + shift + p 打开命令行
  clear site data 清除网站数据 Cookies、WebSQL、Service Workers、Cache Storage、IndexedDB、Local Storage、Application Cache
- ctrl + p 查找文件
- ctrl + shift + i 打开控制台
- alt + 便签展开的小箭头 展开某标签下所有层级的标签
- ctrl + [ / ] 前后切换 devtools tab 页

### More Tools

- Animations 调试动画利器
