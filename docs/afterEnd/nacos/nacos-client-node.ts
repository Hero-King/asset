import axios, { AxiosInstance } from 'axios';
import { EventEmitter } from 'events';
import crypto from 'crypto';

// 类型定义
export interface NacosConfig {
  serverAddr: string; // Nacos服务器地址，如: 'localhost:8848'
  namespace?: string; // 命名空间，默认为'public'
  timeout?: number; // 普通请求超时时间，默认5000ms
  longPollingTimeout?: number; // 长轮询超时时间，默认30000ms
  username?: string; // 用户名，默认'nacos'
  password?: string; // 密码，默认'nacos'
}

export interface ServiceInstance {
  ip: string;
  port: number;
  serviceName: string;
  weight?: number;
  healthy?: boolean;
  enabled?: boolean;
  metadata?: Record<string, string>;
  clusterName?: string;
  ephemeral?: boolean;
}

export interface ConfigChangeEvent {
  dataId: string;
  group: string;
  content: string;
  md5?: string;
}

export interface InstancesChangeEvent {
  serviceName: string;
  clusterName: string;
  instances: ServiceInstance[];
}

// 工具函数
const generateInstanceId = (instance: ServiceInstance): string => {
  return `${instance.ip}:${instance.port}:${instance.serviceName}:${instance.clusterName || 'DEFAULT'}`;
};

const md5 = (str: string): string => {
  return crypto.createHash('md5').update(str).digest('hex');
};

// Nacos 服务发现客户端
class NamingClient extends EventEmitter {
  private config: NacosConfig;
  private axios: AxiosInstance;
  private heartbeatTimers: Map<string, NodeJS.Timeout> = new Map();
  private subscribeTimers: Map<string, NodeJS.Timeout> = new Map();
  private serviceInstances: Map<string, ServiceInstance[]> = new Map();
  private serviceMd5: Map<string, string> = new Map();

  constructor(config: NacosConfig) {
    super();
    this.config = {
      namespace: 'public',
      timeout: 5000,
      longPollingTimeout: 30000,
      username: 'nacos',
      password: 'nacos',
      ...config
    };

    this.axios = axios.create({
      baseURL: `http://${this.config.serverAddr}/nacos/v1/ns`,
      timeout: this.config.timeout,
      auth: {
        username: this.config.username!,
        password: this.config.password!
      }
    });
  }

  /**
   * 注册服务实例
   */
  async registerInstance(instance: ServiceInstance): Promise<boolean> {
    try {
      const params = {
        serviceName: instance.serviceName,
        ip: instance.ip,
        port: instance.port,
        weight: instance.weight || 1,
        healthy: instance.healthy !== undefined ? instance.healthy : true,
        enabled: instance.enabled !== undefined ? instance.enabled : true,
        namespaceId: this.config.namespace,
        clusterName: instance.clusterName || 'DEFAULT',
        ephemeral: instance.ephemeral !== undefined ? instance.ephemeral : true,
        ...(instance.metadata ? { metadata: JSON.stringify(instance.metadata) } : {})
      };

      await this.axios.post('/instance', null, { params });
      
      // 为临时实例启动心跳
      if (params.ephemeral) {
        this.startHeartbeat(instance);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to register instance:', error);
      return false;
    }
  }

  /**
   * 注销服务实例
   */
  async deregisterInstance(instance: ServiceInstance): Promise<boolean> {
    try {
      const params = {
        serviceName: instance.serviceName,
        ip: instance.ip,
        port: instance.port,
        namespaceId: this.config.namespace,
        clusterName: instance.clusterName || 'DEFAULT',
        ephemeral: instance.ephemeral !== undefined ? instance.ephemeral : true
      };

      await this.axios.delete('/instance', { params });
      
      // 停止心跳
      const instanceId = generateInstanceId(instance);
      this.stopHeartbeat(instanceId);
      
      return true;
    } catch (error) {
      console.error('Failed to deregister instance:', error);
      return false;
    }
  }

  /**
   * 获取服务实例列表
   */
  async getInstances(serviceName: string, clusterName?: string): Promise<ServiceInstance[]> {
    try {
      const params = {
        serviceName,
        namespaceId: this.config.namespace,
        clusterName: clusterName || 'DEFAULT'
      };

      const response = await this.axios.get('/instance/list', { params });
      return response.data.hosts.map((host: any) => ({
        ip: host.ip,
        port: host.port,
        serviceName,
        weight: host.weight,
        healthy: host.healthy,
        enabled: host.enabled,
        metadata: host.metadata,
        clusterName: host.clusterName,
        ephemeral: host.ephemeral
      }));
    } catch (error) {
      console.error(`Failed to get instances for service ${serviceName}:`, error);
      return [];
    }
  }

  /**
   * 订阅服务实例变化
   */
  async subscribe(serviceName: string, clusterName?: string): Promise<void> {
    const cluster = clusterName || 'DEFAULT';
    const serviceKey = `${serviceName}@${cluster}`;
    
    // 先获取初始实例
    const instances = await this.getInstances(serviceName, cluster);
    this.serviceInstances.set(serviceKey, instances);
    this.serviceMd5.set(serviceKey, this.calculateInstancesMd5(instances));
    
    // 触发初始数据事件
    this.emit('instancesChange', {
      serviceName,
      clusterName: cluster,
      instances
    } as InstancesChangeEvent);
    
    // 启动定时拉取 (服务发现通常使用定时拉取，Nacos原生也是如此)
    this.startSubscribePolling(serviceName, cluster);
  }

  /**
   * 取消订阅服务实例变化
   */
  unsubscribe(serviceName: string, clusterName?: string): void {
    const cluster = clusterName || 'DEFAULT';
    const serviceKey = `${serviceName}@${cluster}`;
    this.stopSubscribePolling(serviceKey);
    this.serviceInstances.delete(serviceKey);
    this.serviceMd5.delete(serviceKey);
  }

  /**
   * 启动服务实例心跳
   */
  private startHeartbeat(instance: ServiceInstance): void {
    const instanceId = generateInstanceId(instance);
    
    // 清除已有的定时器
    this.stopHeartbeat(instanceId);
    
    // 每5秒发送一次心跳
    const timer = setInterval(async () => {
      try {
        const params = {
          serviceName: instance.serviceName,
          ip: instance.ip,
          port: instance.port,
          namespaceId: this.config.namespace,
          clusterName: instance.clusterName || 'DEFAULT',
          beat: JSON.stringify({
            serviceName: instance.serviceName,
            ip: instance.ip,
            port: instance.port,
            cluster: instance.clusterName || 'DEFAULT',
            weight: instance.weight || 1,
            metadata: instance.metadata || {}
          })
        };

        await this.axios.put('/instance/beat', null, { params });
      } catch (error) {
        console.error(`Heartbeat failed for ${instanceId}:`, error);
      }
    }, 5000);
    
    this.heartbeatTimers.set(instanceId, timer);
  }

  /**
   * 停止服务实例心跳
   */
  private stopHeartbeat(instanceId: string): void {
    const timer = this.heartbeatTimers.get(instanceId);
    if (timer) {
      clearInterval(timer);
      this.heartbeatTimers.delete(instanceId);
    }
  }

  /**
   * 启动订阅轮询
   */
  private startSubscribePolling(serviceName: string, clusterName: string): void {
    const serviceKey = `${serviceName}@${clusterName}`;
    
    // 清除已有的定时器
    this.stopSubscribePolling(serviceKey);
    
    // 每10秒拉取一次实例列表 (Nacos默认策略)
    const timer = setInterval(async () => {
      try {
        const newInstances = await this.getInstances(serviceName, clusterName);
        const newMd5 = this.calculateInstancesMd5(newInstances);
        const oldMd5 = this.serviceMd5.get(serviceKey);
        
        if (newMd5 !== oldMd5) {
          this.serviceInstances.set(serviceKey, newInstances);
          this.serviceMd5.set(serviceKey, newMd5);
          
          // 触发实例变化事件
          this.emit('instancesChange', {
            serviceName,
            clusterName,
            instances: newInstances
          } as InstancesChangeEvent);
        }
      } catch (error) {
        console.error(`Subscribe polling failed for ${serviceKey}:`, error);
      }
    }, 10000);
    
    this.subscribeTimers.set(serviceKey, timer);
  }

  /**
   * 停止订阅轮询
   */
  private stopSubscribePolling(serviceKey: string): void {
    const timer = this.subscribeTimers.get(serviceKey);
    if (timer) {
      clearInterval(timer);
      this.subscribeTimers.delete(serviceKey);
    }
  }

  /**
   * 计算实例列表的MD5值，用于检测变化
   */
  private calculateInstancesMd5(instances: ServiceInstance[]): string {
    return md5(JSON.stringify(instances.sort((a, b) => `${a.ip}:${a.port}`.localeCompare(`${b.ip}:${b.port}`))));
  }

  /**
   * 关闭客户端，清理资源
   */
  close(): void {
    // 清除所有心跳定时器
    this.heartbeatTimers.forEach(timer => clearInterval(timer));
    this.heartbeatTimers.clear();
    
    // 清除所有订阅定时器
    this.subscribeTimers.forEach(timer => clearInterval(timer));
    this.subscribeTimers.clear();
  }
}

// Nacos 配置管理客户端 - 实现真正的长轮询
class ConfigClient extends EventEmitter {
  private config: NacosConfig;
  private axios: AxiosInstance;
  private longPollingClient: AxiosInstance; // 专门用于长轮询的axios实例
  private configCache: Map<string, { content: string; md5: string }> = new Map();
  private listeningConfigs: Set<string> = new Set();
  private isPolling: boolean = false;

  constructor(config: NacosConfig) {
    super();
    this.config = {
      namespace: 'public',
      timeout: 5000,
      longPollingTimeout: 30000,
      username: 'nacos',
      password: 'nacos',
      ...config
    };

    // 普通请求客户端
    this.axios = axios.create({
      baseURL: `http://${this.config.serverAddr}/nacos/v1/cs`,
      timeout: this.config.timeout,
      auth: {
        username: this.config.username!,
        password: this.config.password!
      }
    });

    // 长轮询专用客户端，超时时间更长
    this.longPollingClient = axios.create({
      baseURL: `http://${this.config.serverAddr}/nacos/v1/cs`,
      timeout: this.config.longPollingTimeout,
      auth: {
        username: this.config.username!,
        password: this.config.password!
      }
    });
  }

  /**
   * 获取配置
   */
  async getConfig(dataId: string, group: string = 'DEFAULT_GROUP'): Promise<string | null> {
    try {
      const key = this.getConfigKey(dataId, group);
      const params = {
        dataId,
        group,
        tenant: this.config.namespace
      };

      const response = await this.axios.get('/configs', { params });
      const content = response.data;
      const contentMd5 = md5(content);
      
      // 更新缓存
      this.configCache.set(key, { content, md5: contentMd5 });
      
      return content;
    } catch (error) {
      console.error(`Failed to get config ${dataId}:${group}:`, error);
      return null;
    }
  }

  /**
   * 发布配置
   */
  async publishConfig(
    dataId: string,
    group: string = 'DEFAULT_GROUP',
    content: string
  ): Promise<boolean> {
    try {
      const params = {
        dataId,
        group,
        tenant: this.config.namespace,
        content
      };

      await this.axios.post('/configs', null, { params });
      return true;
    } catch (error) {
      console.error(`Failed to publish config ${dataId}:${group}:`, error);
      return false;
    }
  }

  /**
   * 删除配置
   */
  async deleteConfig(dataId: string, group: string = 'DEFAULT_GROUP'): Promise<boolean> {
    try {
      const key = this.getConfigKey(dataId, group);
      const params = {
        dataId,
        group,
        tenant: this.config.namespace
      };

      await this.axios.delete('/configs', { params });
      
      // 从缓存和监听列表中移除
      this.configCache.delete(key);
      this.listeningConfigs.delete(key);
      
      return true;
    } catch (error) {
      console.error(`Failed to delete config ${dataId}:${group}:`, error);
      return false;
    }
  }

  /**
   * 监听配置变化 - 支持同时监听多个配置
   */
  watchConfig(dataId: string, group: string = 'DEFAULT_GROUP'): void {
    const key = this.getConfigKey(dataId, group);
    this.listeningConfigs.add(key);
    
    // 如果还没有开始长轮询，则启动
    if (!this.isPolling) {
      this.startLongPolling();
    }
  }

  /**
   * 取消监听配置变化
   */
  unwatchConfig(dataId: string, group: string = 'DEFAULT_GROUP'): void {
    const key = this.getConfigKey(dataId, group);
    this.listeningConfigs.delete(key);
    
    // 如果没有监听的配置了，停止长轮询
    if (this.listeningConfigs.size === 0) {
      this.isPolling = false;
    }
  }

  /**
   * 启动长轮询监听配置变化
   * 真正的长轮询实现：一次请求完成后立即发起下一次请求
   */
  private async startLongPolling(): Promise<void> {
    this.isPolling = true;
    
    // 长轮询循环
    while (this.isPolling && this.listeningConfigs.size > 0) {
      try {
        // 准备需要监听的配置信息
        const configList = Array.from(this.listeningConfigs).map(key => {
          const [dataId, group, tenant] = key.split(':');
          const config = this.configCache.get(key);
          return {
            dataId,
            group,
            tenant,
            md5: config?.md5 || ''
          };
        });

        // 构建长轮询请求参数
        const params = {
          tenant: this.config.namespace,
          // Nacos要求的格式：dataId1^group1^md51,dataId2^group2^md52...
          list: configList.map(c => `${c.dataId}^${c.group}^${c.md5}`).join(',')
        };

        // 发起长轮询请求 - 服务器会保持连接直到有变化或超时
        const response = await this.longPollingClient.post('/configs/listener', null, { params });
        
        // 解析响应，获取变化的配置
        if (response.data && response.data !== 'empty') {
          // 响应格式通常是 "dataId^group" 形式的字符串
          const changedConfigs = response.data.split('\n')
            .filter((line: string) => line.trim() !== '');
          
          // 对每个变化的配置，拉取最新内容并触发事件
          for (const changed of changedConfigs) {
            const [dataId, group] = changed.split('^');
            if (dataId && group) {
              const newContent = await this.getConfig(dataId, group);
              if (newContent) {
                this.emit('configChange', {
                  dataId,
                  group,
                  content: newContent,
                  md5: md5(newContent)
                } as ConfigChangeEvent);
              }
            }
          }
        }
        // 如果没有变化，什么都不做，循环会自动发起下一次轮询
      } catch (error) {
        console.error('Long polling error:', error);
        // 出错时等待1秒再重试，避免频繁错误重试
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      // 循环会自动发起下一次长轮询
    }
  }

  /**
   * 生成配置的唯一键
   */
  private getConfigKey(dataId: string, group: string): string {
    return `${dataId}:${group}:${this.config.namespace}`;
  }

  /**
   * 关闭客户端，清理资源
   */
  close(): void {
    this.isPolling = false;
    this.listeningConfigs.clear();
    this.configCache.clear();
  }
}

// 主Nacos客户端类
export class NacosClient {
  public naming: NamingClient;
  public config: ConfigClient;

  constructor(config: NacosConfig) {
    this.naming = new NamingClient(config);
    this.config = new ConfigClient(config);
  }

  /**
   * 关闭客户端
   */
  close(): void {
    this.naming.close();
    this.config.close();
  }
}

// 使用示例
async function example() {
  // 创建Nacos客户端
  const nacosClient = new NacosClient({
    serverAddr: 'localhost:8848',
    namespace: 'public',
    longPollingTimeout: 30000 // 长轮询超时时间，默认30秒
  });

  // 服务注册示例
  const serviceInstance: ServiceInstance = {
    serviceName: 'nodejs-demo-service',
    ip: '127.0.0.1',
    port: 3000,
    weight: 1,
    metadata: { version: '1.0.0' }
  };
  
  await nacosClient.naming.registerInstance(serviceInstance);
  console.log('Service registered successfully');

  // 服务订阅示例
  nacosClient.naming.on('instancesChange', (event) => {
    console.log('Service instances changed:', event);
  });
  
  await nacosClient.naming.subscribe('nodejs-demo-service');

  // 配置管理示例
  await nacosClient.config.publishConfig('demo-config', 'DEFAULT_GROUP', JSON.stringify({
    theme: 'light',
    featureFlags: { newUI: true }
  }));
  
  console.log('Config published successfully');

  // 获取配置
  const config = await nacosClient.config.getConfig('demo-config', 'DEFAULT_GROUP');
  console.log('Get config:', config);

  // 监听配置变化
  nacosClient.config.on('configChange', (event) => {
    console.log('Config changed:', event);
  });
  
  nacosClient.config.watchConfig('demo-config', 'DEFAULT_GROUP');
  // 可以监听多个配置
  // nacosClient.config.watchConfig('another-config', 'DEFAULT_GROUP');

  // 程序退出时清理
  process.on('SIGINT', async () => {
    await nacosClient.naming.deregisterInstance(serviceInstance);
    console.log('Service deregistered');
    
    nacosClient.close();
    process.exit(0);
  });
}

// 运行示例
// example().catch(console.error);
