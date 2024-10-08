# 前端监控

主要包括数据采集, 上报, 存储等;

# 采集

有现成的 SDK, 比如

- <a href="https://github.com/getsentry/sentry" >sentry</a> 从监控错误、错误统计图表、多重标签过滤和标签统计到触发告警，这一整套都很完善，团队项目需要充钱，而且数据量越大钱越贵
- <a href="https://www.fundebug.com/" >fundebug</a>：除了监控错误，还可以录屏，也就是记录错误发生的前几秒用户的所有操作，压缩后的体积只有几十 KB，但操作略微繁琐
- <a href="https://github.com/a597873885/webfunny_monitor">webfunny</a>：也是含有监控错误的功能，可以支持千万级别日 PV 量，额外的亮点是可以远程调试、性能分析，也可以 docker 私有化部署（免费），业务代码加密过
- 百度统计： 一键接入，但是无业务数据

## 性能监控

- fp 表示渲染出第一个像素点。FP 一般在 HTML 解析完成或者解析一部分时候触发
- fcp（First Contentful Paint），表示渲染出第一个内容，这里的"内容"可以是文本、图片、canvas
- lcp （largest contentful Paint），最大内容渲染时间
- 资源加载时间
- 接口请求时间

## 错误监控

- 资源加载出错 使用 window.addEventListener('error', cb, true) 判断 error.target
- JS 错误 使用 window.onerror = (message,source,lineno,colno,error){}
- Promise 错误 使用 window.addEventListener("unhandledrejection", cb)

## 用户行为

- pv
- uv
- 页面停留时间

# 上报

- 方法 常规使用 1\*1 透明的 gif 图片; 使用 navigator.sendBeacon 发送 post 请求
  > 为什么要使用 gif 图片???
  > 没有跨域问题； 不会阻塞页面加载，影响用户体验； 在所有图片中体积最小，相较 BMP/PNG，可以节约 41%/35%的网络资源。
- 时机
  1. settimeout 延迟上报
  2. beforeunload
  3. 前端缓存数据, 达到一定程度后统一上报 合并上报

# 应用发布
> 参考资料： https://www.cnblogs.com/mq0036/p/14306444.html

## 金丝雀发布(一台->剩余)
金丝雀发布是灰度发布的一种。灰度发布是指在黑与白之间，能够平滑过渡的一种发布方式。即在发布过程中一部分用户继续使用老版本，一部分用户使用新版本，不断地扩大新版本的访问流量。最终实现老版本到新版本的过度。

缺点：是一次性的全量发布，发布过程中用户体验并不平滑，有些隐藏深处的bug少量用户可能并不能验证出来问题，需要逐步扩大流量才可以。

## 滚动发布(一台->一台->一台)
相比于金丝雀发布，先发金丝雀，然后全发的方式，滚动发布则是整个发布过程中按批次进行发布。每个批次拉入后都可作为金丝雀进行验证，这样流量逐步放大直至结束。

缺点：是发布和回退时间慢，其次发布工具复杂，负载均衡设备需要具有平滑的拉入拉出能力，一般公司并没有资源投入研发这种复杂的发布工具。再者发布过程中新老版本同时运行，需要注意兼容性问题。

## 蓝绿发布(流量切集群1->发布集群2->流量切集群2->发布集群1->流量走集群1,2)

是采用两个分开的集群对软件版本进行升级的一种方式。它的部署模型中包括一个蓝色集群 Group1 和一个绿色集群 Group2，在没有新版本上线的情况下，两个集群上运行的版本是一致的，同时对外提供服务。

缺点：全量升级，如果V2版本有问题，对用户影响大再者由于升级过程中会服务器资源会减少一半，有可能产生服务器过载问题，不适用于在业务高峰期使用

## 红黑发布
申请一个黑色集群 Group2 ，在 Group2 上部署新版本的服务；等到 Group2 升级完成后，我们一次性地把负载均衡全部指向 Group2 ；把 Group1 集群从负载均衡列表中删除，并释放集群 Group1 中所有机器。

## 功能开关
利用代码中的功能开关来控制发布逻辑，是一种相对比较低成本和简单的发布方式。研发人员可以灵活定制和自助完成的发布方式。这种方式通常依赖于一个配置中心系统，当然如果没有，可以使用简单的配置文件。