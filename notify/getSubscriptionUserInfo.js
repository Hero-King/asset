const { exec } = require('child_process')
const util = require('util')

// 将 exec 转换为返回 Promise 的函数
const execPromise = util.promisify(exec)

async function runCurlCommand(url) {
  if (!url) {
    return
  }
  try {
    const command = `curl -sLI -X GET -m 10 -w 'http_code=%{http_code}' -H 'User-Agent: Clash' ${url}`

    // 使用 await 等待命令执行结果
    let { stdout, stderr } = await execPromise(command)

    if (stderr) {
      console.error(`Error: ${stderr}`)
      return
    }

    // mock

    // 检查状态码
    const httpCodeMatch = stdout.match(/http_code=(\d+)/)
    if (!httpCodeMatch || httpCodeMatch[1] !== '200') {
      console.error('HTTP request failed or did not return status 200')
      return
    }

    // 获取并解析 subscription-userinfo 内容
    const userInfoMatch = stdout.match(/subscription-userinfo: (.*)/)
    if (!userInfoMatch) {
      console.error('subscription-userinfo header not found')
      return
    }

    const userInfo = userInfoMatch[1]
    const data = parseUserInfo(userInfo)

    // 转换流量数据为可读格式
    const readableData = convertToReadableFormat(data)
    return readableData
  } catch (error) {
    console.error(`Error executing curl command: ${error.message}`)
  }
}

function parseUserInfo(userInfo) {
  const userInfoParts = userInfo.split(';').map((part) => part.trim())
  const data = {}

  userInfoParts.forEach((part) => {
    const [key, value] = part.split('=')
    if (key && value) {
      data[key] = parseInt(value, 10)
    }
  })

  return Object.assign(data, { percent: (((data.upload + data.download) / data.total) * 100).toFixed(2) + '%' })
}

function convertToReadableFormat(data) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']

  const convert = (value) => {
    let size = value
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`
  }

  return {
    ...data,
    upload: convert(data.upload),
    download: convert(data.download),
    total: convert(data.total),
    expire: new Date(data.expire * 1000).toLocaleString() // 将过期时间转换为人类可读的格式
  }
}

// 运行函数
exports.default = runCurlCommand
