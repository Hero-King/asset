# ActiveMq

## 安装

使用 docker 安装

```shell
# https://hub.docker.com/r/rmohr/activemq
docker run -p 61616:61616 --name activemq -d  -p 61614:61614 -p 1883:1883  -p 8161:8161 rmohr/activemq
```

> 端口说明  
> 61616 JMS  
> 8161 UI  
> 5672 AMQP (since `rmohr/activemq:5.12.1`)  
> 61613 STOMP (since `rmohr/activemq:5.12.1`)  
> 1883 MQTT (since `rmohr/activemq:5.12.1`)  
> 61614 WS (since `rmohr/activemq:5.12.1`)

## Web console

web 控制台 http://ip:8161 默认用户名密码 admin/admin
<img :src="$withBase('/img/activemq_manage.jpg')"/>

## 原理

### 优势

1、解耦  
2、削峰  
3、异步

### 消息类型

- 一对一(Point To Point)的 queue
- 一对多的发布订阅(订阅者只能接收到订阅后 发布者发布的消息)的 Topic

## 连接

<a href="https://activemq.apache.org/connectivity"> 官方指导文档</a>

- 支持 Ajax
- 支持 websocket 需要使用 Stomp 比如<a href="https://github.com/jmesnil/stomp-websocket">STOMP.js</a>基于 websocket 技术创建 Stomp 客户端

## Topic

消息一对多

### 前端直连

使用 mqtt (只能使用发布/订阅模式,好像不支持 queue)

```js
import * as mqtt from 'mqtt'
export default {
  name: 'XXX',
  created() {
    this.connect()
  },
  beforeDestroy() {
    if (this.client) {
      this.client.end()
      this.client = null
    }
  },
  methods: {
    connect() {
      // const client = mqtt.connect(socketUrl)
      const client = mqtt.connect('mqtt://10.36.30.84:61614', {
        clientId: 'chrome_wjj'
      })

      this.client = client
      client.on('connect', function () {
        console.log('connect')
        client.subscribe('test', function (err) {
          if (!err) {
            // client.publish('test', 'Hello mqtt')
          }
        })
      })

      client.on('error', function () {
        console.log(arguments, 'err')
      })
      client.on('end', function () {
        console.log(arguments, 'end')
      })

      client.on('message', function (topic, message, packet) {
        console.log(arguments)
        // message is Buffer
        console.log(message.toString())
        // client.end()
      })
    }
  }
}
```

<a href="http://jmesnil.net/stomp-websocket/doc/" target="_blank">使用 stomp.js</a>  
下载地址: https://raw.githubusercontent.com/jmesnil/stomp-websocket/master/lib/stomp.js

```js
var url = 'ws://10.36.30.84:61614'
var client = Stomp.client(url)
client.connect({ 'client-id': 'my-client-id-receive' }, function () {
  // client.send('/queue/test', {}, 'Hello, STOMP') 给queue中的test队列发消息

  const destination = '/queue/test' // queue是队列 topic是多对一的那种模式
  client.subscribe(destination, () => {
    console.log('receive msg', arguments)
  })
})
```
