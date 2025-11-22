# Demo

## 储能 APP

### 预览

![预览|200*200](/img/gsyApp/预览.png)

### 我的

![我的 =200*0](/img/gsyApp/我的.png)

#### 消息中心

![消息中心|200*200](/img/gsyApp/消息中心.png)

<!--
### 实时

![实时|200*200](/img/gsyApp/实时.png)

#### 电池堆
![电池堆|200*200](/img/gsyApp/电池堆.png)
#### PCS
![PCS|200*200](/img/gsyApp/PCS.png)
#### 消防
![消防|200*200](/img/gsyApp/消防.png)
#### 通讯状态
![通讯状态|200*200](/img/gsyApp/通讯状态.png)

### 分析

![分析|200*200](/img/gsyApp/分析.png)

### 日志

![日志|200*200](/img/gsyApp/日志.png) -->

## Sentry

<div>
    <button @click="throwError">throw new Error</button>
    <button @click="captureError">使用SDK API手动捕获错误和其他事件</button>
  </div>

<script>
export default {
  methods: {
    throwError(){
        throw new Error('手动抛出的错误');
    },
    captureError(){
        this.Sentry.captureException(new Error('使用SDK API手动捕获错误和其他事件'));
    }
  }
};
</script>
