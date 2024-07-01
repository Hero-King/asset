# 前端监控

主要包括数据采集, 上报, 存储等;

# 采集

有现成的 SDK, 比如

<a href="https://github.com/getsentry/sentry" >sentry</a> 从监控错误、错误统计图表、多重标签过滤和标签统计到触发告警，这一整套都很完善，团队项目需要充钱，而且数据量越大钱越贵
<a href="https://www.fundebug.com/" >fundebug</a>：除了监控错误，还可以录屏，也就是记录错误发生的前几秒用户的所有操作，压缩后的体积只有几十 KB，但操作略微繁琐
<a href="https://github.com/a597873885/webfunny_monitor">webfunny</a>：也是含有监控错误的功能，可以支持千万级别日 PV 量，额外的亮点是可以远程调试、性能分析，也可以 docker 私有化部署（免费），业务代码加密过

## 性能监控

- fp 表示渲染出第一个像素点。FP 一般在 HTML 解析完成或者解析一部分时候触发
- fcp（First Contentful Paint），表示渲染出第一个内容，这里的"内容"可以是文本、图片、canvas
- lcp （largest contentful Paint），最大内容渲染时间
- 资源加载时间
- 接口请求时间

## 错误监控

- 资源加载出错
- JS 错误
- Promise 错误

## 用户行为

- pv
- uv
- 页面停留时间

# 上报

- 方法 常规使用 1\*1 透明的 gif 图片; 使用 navigator.sendBeacon 发送 post 请求
- 时机
  1. settimeout 延迟上报
  2. beforeunload
  3. 前端缓存数据, 达到一定程度后统一上报
