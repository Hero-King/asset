const { NacosConfigClient } = require('nacos')

// Nacos配置客户端
const configClient = new NacosConfigClient({
  serverAddr: '192.168.1.3:8848',
  namespace: 'public'
})

async function startConfigDemo() {
  // 监听特定dataId的配置
  const dataId = 'frontend-config'
  const group = 'DEFAULT_GROUP'

  // 获取初始配置
  const content = await configClient.getConfig(dataId, group)
  console.log('初始配置:', content)
  updateApplicationConfig(content)

  console.log('配置监听已启动，修改Nacos中的配置将在这里显示...')

  // 监听配置变化
  configClient.subscribe({
    dataId,
    group
  }, (content) => {
    console.log('配置发生变化:', content)
    // 这里可以添加配置变化后的处理逻辑
    updateApplicationConfig(content)
  })
}

// 处理配置更新的函数
function updateApplicationConfig(config) {
  try {
    const configObj = JSON.parse(config)
    console.log('应用配置已更新:', {
      theme: configObj.theme,
      apiUrl: configObj.apiUrl,
      featureFlags: configObj.featureFlags
    })
    // 实际应用中，这里可以根据新配置更新应用状态
  } catch (e) {
    console.error('解析配置失败:', e)
  }
}

startConfigDemo().catch(console.error)
