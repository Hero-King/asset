# 前端监控

主要包括数据采集, 上报, 存储等;

## 采集

有现成的 SDK, 比如

- <a href="https://github.com/getsentry/sentry" >sentry</a> 从监控错误、错误统计图表、多重标签过滤和标签统计到触发告警，这一整套都很完善，团队项目需要充钱，而且数据量越大钱越贵
- <a href="https://www.fundebug.com/" >fundebug</a>：除了监控错误，还可以录屏，也就是记录错误发生的前几秒用户的所有操作，压缩后的体积只有几十 KB，但操作略微繁琐
- <a href="https://github.com/a597873885/webfunny_monitor">webfunny</a>：也是含有监控错误的功能，可以支持千万级别日 PV 量，额外的亮点是可以远程调试、性能分析，也可以 docker 私有化部署（免费），业务代码加密过
- 百度统计： 一键接入，但是无业务数据

### 性能监控

- fp 表示渲染出第一个像素点。FP 一般在 HTML 解析完成或者解析一部分时候触发
- fcp（First Contentful Paint），表示渲染出第一个内容，这里的"内容"可以是文本、图片、canvas
- lcp （largest contentful Paint），最大内容渲染时间
- 资源加载时间
- 接口请求时间

### 错误监控

- 资源加载出错 使用 window.addEventListener('error', cb, true) 判断 error.target
- JS 错误 使用 window.onerror = (message,source,lineno,colno,error){}
- Promise 错误 使用 window.addEventListener("unhandledrejection", cb)

### 用户行为

- pv
- uv
- 页面停留时间

## 上报

- 方法 常规使用 1\*1 透明的 gif 图片; 使用 navigator.sendBeacon 发送 post 请求
  > 为什么要使用 gif 图片???
  > 没有跨域问题； 不会阻塞页面加载，影响用户体验； 在所有图片中体积最小，相较 BMP/PNG，可以节约 41%/35%的网络资源。
- 时机
  1. settimeout 延迟上报
  2. beforeunload
  3. 前端缓存数据, 达到一定程度后统一上报 合并上报

### Sentry

#### 一、核心数据模型（Sentry 存储的核心信息）

1. Event（事件）

- 定义：Sentry 中最小的数据单元，代表一次 “可被监控的事件”（最常见的是「错误事件」，也包括性能事件、日志事件等）。
- 通俗理解：比如 “用户点击按钮时触发的 JS 报错”“NestJS 接口查询数据库失败”“Vue 组件渲染异常”，每一次这类行为都会生成一个 Event。
- 包含关键信息：
  - 错误详情：错误消息、堆栈跟踪、错误类型（如 TypeError、500 Internal Server Error）；
  - 上下文信息：发生时间、环境（production/development）、版本（release）、用户 ID、设备 / 浏览器信息、请求参数；
  - 自定义信息：通过代码添加的 tags（标签）、extra（额外字段）、fingerprint（指纹）。
- 实际用途：Event 是排查问题的基础，通过它能还原 “谁在什么场景下遇到了什么问题”。

2. Issue（问题）

- 定义：多个 “相似 Event” 的聚合体，Sentry 会自动将重复 / 相似的 Event 归为一个 Issue，避免重复告警和数据冗余。
- 通俗理解：比如 “前端某组件 undefined 报错”，100 个用户触发了同样的错误，Sentry 不会生成 100 个独立通知，而是聚合为 1 个 Issue，显示 “100 次事件，影响 50 个用户”。
- 聚合规则：
  - 默认：基于「错误消息 + 堆栈跟踪 + 上下文」自动计算 fingerprint（指纹），指纹相同则归为同一 Issue；
  - 自定义：可通过代码设置 fingerprint: ['{{ error.type }}', '{{ request.url }}']，手动指定聚合维度（如按错误类型 + 请求 URL 聚合）。
- 状态管理：每个 Issue 有明确状态，支持团队协作：
  - Unresolved（未解决）：新发现的问题；
  - In Progress（处理中）：开发者正在排查；
  - Resolved（已解决）：代码修复后标记，后续若再出现会自动 reopen；
  - Ignored（已忽略）：良性错误（如第三方 SDK 报错），手动忽略后不再告警。

3. Project（项目）

- 定义：Sentry 中用于隔离不同应用 / 模块的 “容器”，每个 Project 有独立的 DSN、配置、告警规则。
- 通俗理解：相当于给你的应用 “分文件夹”—— 比如 “Vue 前端项目”“NestJS 后端项目”“移动端 App 项目”，分别创建独立 Project，避免数据混淆。
- 核心配置：每个 Project 对应唯一的 DSN（数据上报地址），SDK 初始化时需指定该 DSN，才能将 Event 上报到正确的 Project。
- 最佳实践：
  - 前后端分离项目：建议前端、后端各创建 1 个 Project（如 vue-frontend、nest-backend），便于区分前后端错误；
  - 多环境：无需创建多个 Project，通过 environment 字段（production/staging/development）区分环境。

4. Release（版本）

- 定义：关联到代码版本的标识，用于标记 “哪个版本的代码出现了问题”。
- 通俗理解：比如你的 Vue 项目 package.json 版本是 1.0.0，NestJS 项目版本也是 1.0.0，可统一设置 release: 'my-app@1.0.0'，Sentry 会将前后端的 Event 关联到同一版本。
- 核心作用：
  - 快速定位问题版本：比如 “Issue X 在 release 1.0.1 中首次出现，1.0.2 中仍存在”，可锁定是 1.0.1 版本的代码引入的问题；
  - 自动关联代码提交：若集成了 GitHub/GitLab，Sentry 可显示该版本的代码提交记录，甚至定位到具体提交的开发者；
  - 批量解决：发布新版本后，可标记 “该 release 已修复所有未解决 Issue”，自动将关联的 Issue 设为 Resolved。
- 配置方式：
  - 前端（Vue）：Sentry.init({ release: 'my-vue-app@' + process.env.npm_package_version })；
  - 后端（NestJS）：SentryModule.forRoot({ release: 'my-nest-app@' + process.env.npm_package_version })。

5. Environment（环境）

- 定义：标记 Event 发生的 “部署环境”，用于区分不同环境的错误（避免开发环境的错误干扰生产环境告警）。
- 常用值：production（生产）、staging（预发布）、development（开发）、test（测试）。
- 核心作用：
  - 过滤数据：在 Sentry 后台可筛选 “仅查看 production 环境的 Issue”，聚焦线上问题；
  - 差异化配置：告警规则可设置 “仅 production 环境触发短信告警，staging 环境仅邮件通知”。
- 配置方式：
  - 前端：Sentry.init({ environment: process.env.NODE_ENV })；
  - 后端：SentryModule.forRoot({ environment: process.env.NODE_ENV })。

#### 二、核心功能概念

6. DSN（Data Source Name）

- 定义：数据上报的唯一标识 URL，相当于 Sentry Project 的 “地址”，SDK 通过 DSN 知道将 Event 上报到哪个 Project。
- 格式：https://<public-key>@<sentry-host>/<project-id>（如 https://abc123.sentry.io/456）。
- 获取方式：Sentry 项目 →「Project Settings → Client Keys (DSN)」。
- 安全注意：
  - DSN 包含 public-key（公钥），无敏感信息，可直接写在前端代码中；
  - 避免泄露 auth-token（私有令牌），仅在后端上传 Source Map、操作 API 时使用。

7. SDK（Software Development Kit）

- 定义：Sentry 提供的语言 / 框架专用工具库，用于在应用中捕获 Event、上报数据。
- 常用 SDK：
  - 前端（Vue）：@sentry/vue（适配 Vue 3）、@sentry/vue@6.x（适配 Vue 2）；
  - 后端（NestJS）：@sentry/nestjs（Nest 专用模块）、@sentry/node（Node.js 通用）；
  - 其他：@sentry/react、@sentry/flutter、@sentry/python 等，覆盖主流语言 / 框架。
- 核心能力：
  - 自动捕获：无需手动埋点，自动捕获系统错误（如 JS 语法错误、Nest 控制器异常）、路由错误、接口错误；
  - 手动上报：通过 Sentry.captureException(err)（捕获异常）、Sentry.captureMessage('自定义消息')（上报自定义事件）；
  - 上下文补充：支持添加用户信息、标签、额外字段，丰富 Event 详情。

8. Source Map（源码映射）

- 定义：映射压缩混淆后的代码与原始源码的文件，用于还原错误堆栈的真实位置。
- 为什么需要：前端项目构建后（如 VuePress npm run build），JS 文件会被压缩、混淆（变量名简化、代码合并），直接上报的错误堆栈是乱码（如 a.b.c is undefined），无法定位源码行号。
- 核心流程：
  - 项目构建时生成 .map 后缀的 Source Map 文件；
  - 将 Source Map 上传到 Sentry（通过 Sentry CLI 或 Vite/Webpack 插件）；
  - 错误发生时，Sentry 用 Source Map 还原堆栈，显示原始源码的文件名、行号、变量名。
- 关键配置：上传时需指定 release 版本，且与 SDK 配置的 release 一致，否则无法匹配还原。

9. Alert（告警）

- 定义：基于 Issue/Event 触发的通知规则，用于及时告知开发者 “线上出现问题”。
- 触发条件（常用）：
  - 新 Issue 首次出现（如 “生产环境新增错误，需立即关注”）；
  - Issue 事件数阈值（如 “5 分钟内同一 Issue 发生 ≥3 次”）；
  - 影响用户数阈值（如 “Issue 影响 ≥10 个用户”）；
  - 性能阈值（如 “接口响应时间 90 分位＞ 3s”）。
- 通知渠道：支持邮件、Slack、钉钉、企业微信、短信、电话等，可按告警级别（P0/P1/P2）配置不同渠道（如 P0 级告警触发短信 + 电话，P1 级触发企业微信）。

10. User（用户）

- 定义：关联 Event 到具体用户的标识，用于定位 “哪些用户遇到了问题”。
- 核心信息：可通过 SDK 配置用户的 id（唯一标识）、email、username、ip_address 等，避免敏感信息（如手机号、身份证号）。
- 配置方式：
  - 前端：

```javascript
Sentry.setUser({
  id: localStorage.getItem('userId'), // 从本地存储获取用户ID
  email: 'user@example.com',
  username: 'test-user'
})
```

- 后端（NestJS）：

```javascript
// 在拦截器/过滤器中设置
Sentry.setUser({ id: req.user.id, email: req.user.email })
```

- 作用：排查问题时，可查看 “该用户的操作轨迹”（如用户 A 触发了 3 次错误，分别在哪些页面、什么时间），甚至联系用户了解场景。

11. Tag（标签）与 Extra（额外字段）

- Tag（标签）：
  - 定义：键值对形式的分类标识，用于快速筛选、聚合 Event（如 module: 'user'、browser: 'Chrome'）；
  - 常用场景：标记错误所属模块（用户模块、支付模块）、设备类型（PC / 移动端）、接口路径（/api/login）；
  - 配置方式：Sentry.setTag('module', 'payment') 或捕获错误时添加：
    ```javascript
    Sentry.captureException(err, { tags: { module: 'payment' } })
    ```
- Extra（额外字段）：
  - 定义：存储额外的结构化数据，用于补充上下文（如请求参数、业务数据）；
  - 常用场景：上报支付错误时，添加 extra: { orderId: '123456', amount: 100 }，便于排查该订单的支付流程；
  - 配置方式：`Sentry.captureException(err, { extra: { orderId: orderId } })`。

12. Trace（追踪）与 Transaction（事务）

- 定义：Sentry 性能监控的核心概念，用于追踪 “一次用户操作的全链路耗时”（如 “用户登录 → 查询用户信息 → 加载首页”）。
- Transaction（事务）：一次完整的操作单元（如 “页面加载”,"API请求"），范围是原子级操作, 包含多个 Span（跨度，如 “接口请求”“数据库查询”“组件渲染”）；
- Trace（追踪）：跨服务的事务关联（如前端 “登录按钮点击” 事务 → 后端 “/api/login” 接口事务 → 数据库 “查询用户” 事务），通过 traceId 关联，实现全链路追踪, 包含多个关联的Transaction。
- 使用场景：监控核心业务链路的性能（如 “下单流程总耗时 2s，其中支付接口耗时 1.5s”），定位性能瓶颈。

#### 三、核心流程串联（帮你理解概念间的关系）

以 Vue+NestJS 项目的 “用户登录失败” 为例，串联上述概念：

- 用户在 Vue 前端点击 “登录”，触发接口请求 /api/login，NestJS 后端查询数据库时抛出错误（如用户不存在）；
- 后端 SDK（@sentry/nestjs）自动捕获该错误，生成一个 Event，包含错误堆栈、environment: 'production'、release: 'my-app@1.0.0'、user: { id: '789' }、tag: { module: 'auth' }；
- 前端 SDK（@sentry/vue）通过 Axios 拦截器捕获接口 500 错误，也生成一个 Event，关联同一 release 和 user；
- Sentry 收到前后端的 Event 后，按 fingerprint 聚合（若为同一根因），生成一个 Issue；
- 若该 Issue 满足 Alert 规则（如 “生产环境新 Issue 首次出现”），Sentry 通过企业微信渠道发送告警；
- 开发者在 Sentry 后台查看该 Issue，通过 Source Map 还原后端错误的源码位置，通过 Extra 字段查看请求参数（如用户名 test），通过 User 字段定位受影响用户；
- 修复代码后，发布新版本 1.0.1，标记该 Issue 为 Resolved，后续若再出现会自动 reopen。

#### 四、关键概念速查表（快速回顾）

| 概念 | 核心作用 | 通俗理解 |
|------|----------|----------|
| Event | 存储单次错误 / 性能数据 | 一次 "错误记录" |
| Issue | 聚合相似 Event，便于管理 | 一个 "问题工单" |
| Project | 隔离不同应用 / 模块 | 一个 "应用文件夹" |
| Release | 关联代码版本 | 标记 "哪个版本出的问题" |
| Environment | 区分部署环境 | 标记 "生产 / 开发环境的问题" |
| DSN | 数据上报地址 | 应用与 Sentry 的 "通信地址" |
| SDK | 捕获并上报 Event | 应用与 Sentry 的 "连接器" |
| Source Map | 还原压缩代码的错误堆栈 | 给混淆代码 "解密" |
| Alert | 异常时触发通知 | "问题警报" |
| Tag/Extra | 补充上下文，便于筛选排查 | 给错误 "打标签、加备注" |
| Trace/Transaction | 监控全链路性能 | 追踪 "一次操作的耗时分布" |


## 应用发布

> 参考资料： https://www.cnblogs.com/mq0036/p/14306444.html

### 金丝雀发布(一台->剩余)

金丝雀发布是灰度发布的一种。灰度发布是指在黑与白之间，能够平滑过渡的一种发布方式。即在发布过程中一部分用户继续使用老版本，一部分用户使用新版本，不断地扩大新版本的访问流量。最终实现老版本到新版本的过度。

缺点：是一次性的全量发布，发布过程中用户体验并不平滑，有些隐藏深处的 bug 少量用户可能并不能验证出来问题，需要逐步扩大流量才可以。

### 滚动发布(一台->一台->一台)

相比于金丝雀发布，先发金丝雀，然后全发的方式，滚动发布则是整个发布过程中按批次进行发布。每个批次拉入后都可作为金丝雀进行验证，这样流量逐步放大直至结束。

缺点：是发布和回退时间慢，其次发布工具复杂，负载均衡设备需要具有平滑的拉入拉出能力，一般公司并没有资源投入研发这种复杂的发布工具。再者发布过程中新老版本同时运行，需要注意兼容性问题。

### 蓝绿发布(流量切集群 1->发布集群 2->流量切集群 2->发布集群 1->流量走集群 1,2)

是采用两个分开的集群对软件版本进行升级的一种方式。它的部署模型中包括一个蓝色集群 Group1 和一个绿色集群 Group2，在没有新版本上线的情况下，两个集群上运行的版本是一致的，同时对外提供服务。

缺点：全量升级，如果 V2 版本有问题，对用户影响大再者由于升级过程中会服务器资源会减少一半，有可能产生服务器过载问题，不适用于在业务高峰期使用

### 红黑发布

申请一个黑色集群 Group2 ，在 Group2 上部署新版本的服务；等到 Group2 升级完成后，我们一次性地把负载均衡全部指向 Group2 ；把 Group1 集群从负载均衡列表中删除，并释放集群 Group1 中所有机器。

### 功能开关

利用代码中的功能开关来控制发布逻辑，是一种相对比较低成本和简单的发布方式。研发人员可以灵活定制和自助完成的发布方式。这种方式通常依赖于一个配置中心系统，当然如果没有，可以使用简单的配置文件。
