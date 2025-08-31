const { NacosNamingClient } = require('nacos');
const http = require('http');

// Nacos 连接信息
const nacosHost = '192.168.1.3';
const nacosPort = 8848;

const nacosClient = new NacosNamingClient({
    logger: console,
    serverList: `${nacosHost}:${nacosPort}`,
    namespace: 'public', // 默认命名空间
});

// 目标服务信息
const targetServiceName = 'nodejs-sdk-service';

async function consumeService() {
    try {
        await nacosClient.ready();

        // 获取服务实例列表
        const instances = await nacosClient.getAllInstances(targetServiceName);
        if (!instances || instances.length === 0) {
            console.log(`No instances of '${targetServiceName}' found.`);
            return;
        }

        // 随机选择一个健康的实例
        const healthyInstances = instances.filter(instance => instance.healthy);
        if (healthyInstances.length === 0) {
            console.log(`No healthy instances of '${targetServiceName}' found.`);
            return;
        }

        const instance = healthyInstances[Math.floor(Math.random() * healthyInstances.length)];
        const { ip, port } = instance;

        console.log(`Found service instance: ${ip}:${port}. Calling...`);

        // 调用选定的服务实例
        http.get(`http://${ip}:${port}`, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                console.log(`Response from service: ${data}`);
            });
        }).on('error', (err) => {
            console.error('Failed to call service:', err.message);
        });

    } catch (error) {
        console.error('Failed to get service instances:', error);
    }
}

// 每隔 5 秒调用一次服务
setInterval(consumeService, 5000);
console.log(`Starting service consumer for '${targetServiceName}'.`);