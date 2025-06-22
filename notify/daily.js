const axios = require('axios').default
const runCurlCommand = require('./getSubscriptionUserInfo').default
const argv = require('minimist')(process.argv.slice(2))

const config = {
  token: argv.token
  // topic: 'home'
}
var formattedTime = new Date().toLocaleString('zh-CN')

async function main() {
  const res = await runCurlCommand(argv.subUrl)
  let subscribeInfo = '流量信息: '
  res &&
    Object.keys(res).forEach((key) => {
      subscribeInfo += `${key}: ${res[key]}  `
    })

  axios({
    url: 'http://www.pushplus.plus/send',
    method: 'POST',
    data: {
      ...config,
      title: 'Daily Notify',
      // 只能打开超链接 不能打开小程序
      // content: `
      //     <p><a href="https://www.baidu.com">百度</a></p>
      //     <p><a href="#小程序://石化会员/CbDeTGDnlsm2tzC">中石化签到</a></p>
      //     `
      content: `
      <h4>时间: ${formattedTime}</h4>
      <p>小程序签到</p>
      <p>支付宝偷能量 签到</p>
      <div>${subscribeInfo}</div>
      `
    }
  })
    .then(({ data }) => {
      if (data.code == 200) {
        console.log('success', data.data)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

main()
