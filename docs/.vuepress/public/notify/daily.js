const axios = require('axios').default
const argv = require('minimist')(process.argv.slice(2))
console.log(argv.token)
const config = {
  token: argv.token
  // topic: 'home'
}

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
    <p>小程序签到</p>
    `
  }
})
  .then(({ data }) => {
    if (data.code == 200) {
      console.log('success')
    }
  })
  .catch((err) => {
    console.log(err)
  })