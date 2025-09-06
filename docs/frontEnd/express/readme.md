# Express源码学习

## 常规使用
```js
const express = require("express");

const app = express()

app.get('/info', (req, res, next) => {
    console.log("req time: ", Date.now(), req.url);
    next()
}, (req, res, next) => {
    console.log("secode layer");
    next()
}, (req, res, next) => {
    console.log("third layer");
    res.json("/info")
})

app.get('/info2', (req, res, next) => {
    console.log("req time: ", Date.now(), req.url);
    next()
}, (req, res, next) => {
    console.log("secode layer");
    next()
}, (req, res, next) => {
    console.log("third layer");
    res.json("/info")
})

app.listen(3000, () => {
    console.log(`Example app listening on port 3000`)
})
```
## 模块类关系图

```plantuml
@startuml ClassRelationship

enum methods {
    get,
    post,
    put,
    delete,
    patch,
    options,
    head,
    connect,
    ...other http methods,
}

' 1. 引入 Node.js 原生模块（父类）
class EventEmitter {
    ' Node.js EventEmitter 核心方法（精简关键）
    + on(eventName: string, listener: Function): this
    + emit(eventName: string, ...args: any[]): boolean
    + once(eventName: string, listener: Function): this
    + off(eventName: string, listener: Function): this
    # _events: Object  ' 私有属性：存储事件与监听器映射
}
' 基础类型定义
interface MiddlewareFunction {
    + (req: Request, res: Response, next: NextFunction): void
}

interface NextFunction {
    + (err?: Error): void
}

' Express 核心模块
package express {
    class Express {
        - application: Application
        - request : Request
        - response : Response
        + default(): Application
        + json(): void
        + raw(): void
        + Router(): Router # 创建一个新的路由对象
        + static(root: string): void
        + text(): void
        + urlencoded(): void
    }
}

' Application 核心类
class Application extends EventEmitter {
    + request: Request
    + response: Response
    + cache: Object               # 缓存
    + engines: Object             # 模板引擎
    + settings: Object           # 应用配置
    + router: Router             # 路由分发器
    + locals: Object              # 模板变量,在通过 res.render 渲染的模板中可用
    + mountpath: String           # 当前应用被当做子应用挂载的一个或多个路径

    + init(): void                # 初始化 server
    + defaultConfiguration(): void  # 默认配置,监听mount事件
    + handle(req: Request, res: Response, out: NextFunction): void  # 处理请求
    + use(path: String, middleware: MiddlewareFunction): Application    # 使用中间件,代理的Router.use
    + use(middleware: MiddlewareFunction): Application
    + use(...middleware: MiddlewareFunction[]): Application
    + route(path: String): Router   # 为path创建一个路由,代理Router.route()
    + param(name: String, handler: ParamHandlerFunction): Application  # 为参数设置处理函数,代理Router.param()
    + set(setting: String, value?: any): Application   # 设置/获取this.settings对象
    + path(path: String): String    # 获取当前应用挂载完整路径
    + get/post/put/methods/all(path: String, ...handlers: MiddlewareFunction[]): Application # 路由处理, 代理Route.methods()
    + listen(port: Number, hostname: String, backlog: Number, callback: Function): Server
}

' Router 路由系统
class Router {
    - stack: Layer[]             # 路由层栈
    - methods: Object            # 注册路由的 HTTP 方法
    - params: Object             # 参数解析器
    - caseSensitive: Boolean     # 路径大小写敏感
    - mergeParams: Boolean       # 合并参数

    + route(path: String): Route    # 创建一个Route(path) 和 layer(path, route.dispatch)
    + get/post/put/methods/all(path: String, ...handlers: MiddlewareFunction[]): Router # 路由处理, 代理Route.methods()
    + use(path: String, middleware: MiddlewareFunction): Router
    + handle(req: Request,res: Response, callback:Function ): void  # 处理请求
}

' Route 路由匹配层
class Route {
    - path: String               # 路由路径
    - stack: Layer[]             # 处理函数栈
    - methods: Object            # 支持的 HTTP 方法
    - sensitive: Boolean         # 大小写敏感
    - strict: Boolean            # 严格路径匹配

    + get(handler: MiddlewareFunction): Route
    + post(handler: MiddlewareFunction): Route
    + all(handler: MiddlewareFunction): Route
    + dispatch(req: Request, res: Response, out: NextFunction): void # 处理请求
}

' Layer 路由处理单元
class Layer {
    - path: String               # 匹配路径
    - handle: MiddlewareFunction # 处理函数
    - method: String             # 匹配的 HTTP 方法
    - name: String               # 层名称
    - params: Object             # 参数缓存

    + handle_request(req: Request, res: Response, next: NextFunction): void
    + match(path: String): Boolean
}

' 请求对象扩展
class Request extends IncomingMessage{
    - originalUrl: String        # 原始 URL
    - baseUrl: String            # 挂载路径
    - method: String             # 请求方法
    - url: String                # 当前 URL
    - path: String                # 当前
    - protocol: String                # 当前
    - host: String                # 当前
    - ip: String                # 当前
    - headers: Object            # 请求头
    - query: Object              # 查询参数
    - params: Object             # 路由参数
    - body: Object               # 请求体

    + get(headerName: String): String
    + header(headerName: String): String
    + is(types: String[]): Boolean
    + accepts(types: String[]): String
}

' 响应对象扩展
class Response extends ServerResponse{
    - statusCode: Number         # 状态码
    - headersSent: Boolean       # 响应是否已发送
    - _headers: Object           # 响应头

    + send(body: Any): Response
    + status(code: Number): Response
    + json(data: Object): Response
    + redirect(url: String): Response
    + set(header: String, value: String): Response
}

' 服务器封装
class Server {
    - httpServer: http.Server    # Node.js 原生服务器
    - _events: EventEmitter      # 事件发射器

    + listen(port: Number, hostname: String, backlog: Number, callback: Function): Server
    + close(callback: Function): void
}

' 关联关系
Express --> Application : creates
Application --> Router : uses
Router --> Route : creates
Route --> Layer : contains
Router --> Layer : contains
Layer --> MiddlewareFunction : executes
Application --> Server : creates
Request --> Response : associated
Response --> NextFunction : uses
Application --> Application : uses
```


## 请求处理时序图
应用启动后创建好Router的layer 和Route的layer stack, 请求处理时串行Router的layer stack中所有的Route的layer stack

```plantuml
@startuml ExpressSimplifiedSequence
actor Developer
participant "app" as Application
participant "app.router" as Router
participant "route" as Route
participant "layer" as Layer


' 应用初始化
Developer -> Application: const app = express()
Application -> Application: app.init() \n app.defaultConfiguration()

' 注册/info路由
Developer -> Application: app.get('/info', h1, h2, h3)
Application -> Router: router.route('/info')
Router -> Router: 初始化(单例模式)
Router -> Route: new Route('/info')
Router -> Layer: new Layer('/info',router.dispatch)
Router -> Router: Layer关联Route\nrouter.stack.push(layer)
Router -> Application: 返回Route
Application -> Route: route.get(h1, h2, h3)
Route -> Layer: new Layer('/', h1)
Route -> Layer: new Layer('/', h2)
Route -> Layer: new Layer('/', h3)
Route -> Route: this.stack.push(layer)
Route -> Application: return

' 注册/info2路由
Developer -> Application: app.get('/info2', h1, h2, h3)
Application -> Router: router.route('/info2')
Router -> Route: new Route('/info2')
Router -> Layer: new Layer('/info2',router.dispatch)
Router -> Router: Layer关联Route\nrouter.stack.push(layer)
Router -> Application: 返回Route
Application -> Route: route.get(h1, h2, h3)
Route -> Layer: new Layer('/', h1)
Route -> Layer: new Layer('/', h2)
Route -> Layer: new Layer('/', h3)
Route -> Route: this.stack.push(layer)
Route -> Application: return


' 启动服务器
Developer -> Application: app.listen(3000, callback)

' 创建请求
Developer -> Application: req.get('/info')
Application -> Application: this.handle(req, res, out)
note left of Application
这里的req,res为原始的请求对象和响应对象
  - req.res = res; res.req = req; 保存关联
  - Object.setPrototypeOf(req, app.request) 
  - Object.setPrototypeOf(res, app.response)
  - 原型方式拓展req,res
end note
Application -> Router: router.handle(req, res, finalhandler)
Router -> Layer: 启动next方法 \n 遍历stack查找匹配的layer和Route \nlayer.match('/info')
Layer -> Router: 返回是否match
Router -> Route: route._handlesMethod('GET')\n判断Route的方法是否匹配
Route -> Router: 返回是否match
Router -> Layer: layer.handleRequest(req, res, next)
Layer -> Route: route.dispatch(req, res, next)
Route -> Layer: 启动next方法 \n 遍历stack根据method查找匹配的layer \nlayer.handleRequest(req, res, next)\n执行传入的h1,h1中继续调用next

Route -> Layer: layer.handleRequest(req, res, next)\n执行传入的h2,h2中继续调用next
Route -> Layer: layer.handleRequest(req, res, next)\n执行传入的h3,h3中继续调用next
note left of Route
一直在压栈next方法,最后在慢慢弹栈
end note

Router -> Layer: Router.next\n查找匹配stack中其他的layer\n重复上述步骤
Router -> Developer: 响应内容

@enduml
```
