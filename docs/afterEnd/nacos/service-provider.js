const { NacosNamingClient } = require('nacos');
const http = require('http');

// Nacos 连接信息
const nacosHost = '192.168.1.3';
const nacosPort = 8848;

// 实例化 Nacos 命名服务客户端
const nacosClient = new NacosNamingClient({
    logger: console,
  serverList: `${nacosHost}:${nacosPort}`,
  namespace: 'public', // 默认命名空间
});

// 服务信息
const serviceName = 'nodejs-sdk-service';
const serviceIp = '127.0.0.1';
const servicePort = 3000;

// 服务启动
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(`Hello from ${serviceName} on port ${servicePort}`);
});

server.listen(servicePort, async () => {
  console.log(`Service provider started at http://${serviceIp}:${servicePort}`);
  try {
    // 注册服务
    await nacosClient.ready();
    await nacosClient.registerInstance(serviceName, {
      ip: serviceIp,
      port: servicePort,
      // 也可以添加其他元数据
      metadata: {
        env: 'production'
      }
    });
    console.log(`Service '${serviceName}' registered to Nacos.`);
  } catch (error) {
    console.error('Failed to register service:', error);
  }
});

// 优雅停机处理，确保服务注销
process.on('SIGINT', async () => {
  try {
    console.log(`\nStopping service provider...`);
    await nacosClient.deregisterInstance(serviceName, {
      ip: serviceIp,
      port: servicePort,
    });
    console.log(`Service '${serviceName}' deregistered from Nacos.`);
    process.exit(0);
  } catch (error) {
    console.error('Failed to deregister service:', error);
    process.exit(1);
  }
});