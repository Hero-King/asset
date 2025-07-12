const puppeteer = require('puppeteer-core')
const fs = require('fs')
const path = require('path')

const { username, password, cookiePath } = {
  username: 'your-username',
  password: 'your-password',
  cookiePath: path.join(__dirname, 'cookies-debug.json')
}
const publishPageUrl = 'https://creator.xiaohongshu.com/publish/publish?source=official&from=menu&target=video'
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
/**
 *
 * @param {puppeteer.Page} page
 * @param {puppeteer.BrowserContext} context
 */
async function login(page, context) {
  await page.goto(publishPageUrl, { waitUntil: 'networkidle2' })
  console.log('进入哪里了', page.url())

  await page.waitForSelector('div.login-box-container')
  console.log('已经打开登录页')
  await sleep(3000)
  console.log("等待三秒");
  
  await page.waitForNavigation({ waitUntil: 'networkidle2' })

  //   const client = await page.target().createCDPSession()
  //   const { cookies } = await client.send('Network.getCookies', {
  //     urls: ['https://creator.xiaohongshu.com']
  //   })

  // 使用 page.cookies() 获取当前页面的所有 Cookie
  const cookies = await context.cookies()
  console.log(cookies, '获取到的cookies', cookies.length)

  fs.writeFileSync(cookiePath, JSON.stringify(cookies, null, 2))
  console.log('登录成功并已保存 Cookie')
}

/**
 * 加载 Cookie
 * @param {puppeteer.BrowserContext} context
 * @param {import('puppeteer').Page} page
 * @param {string} cookiePath
 */
async function loadCookies(context, page, cookiePath) {
  if (!fs.existsSync(cookiePath)) {
    console.log('未找到 Cookie 文件，需首次登录')
    return false
  }

  const cookies = JSON.parse(fs.readFileSync(cookiePath, 'utf-8'))
  const cookie = cookies.map((c) => ({
    name: c.name,
    value: c.value,
    // domain: c.domain,
    domain: '.xiaohongshu.com',
    path: c.path,
    // secure: c.secure,
    // httpOnly: c.httpOnly,
    // sameSite: c.sameSite || 'None',
    // expires: c.expires ? Math.floor(c.expires) : Date.now() + 86400e3
  }))
  try {
    await context.setCookie(...cookie)
    // await page.reload()
    console.log((await context.cookies()).length);
    
  } catch (error) {
    console.log(error)
    return false
  }

  await page.goto(publishPageUrl, { waitUntil: 'networkidle2' })

  const isLoggedIn = page.url().includes('publish/publish') && (await page.$('.user-avatar')) !== null

  if (!isLoggedIn) {
    console.log('Cookie 已失效，请重新登录')
    return false
  }

  console.log('登录状态有效')
  return true
}

async function publishNote(page, title, content, imagePaths) {
  console.log(arguments)
  return

  await page.waitForSelector('input.title-input')
  await page.type('input.title-input', title)
  await page.type('.note-textarea', content)

  const inputUploadHandle = await page.$('input.upload-input')
  for (const imagePath of imagePaths) {
    await inputUploadHandle.uploadFile(imagePath)
    await page.waitForTimeout(1000)
  }

  await page.click('.publish-button')
  await page.waitForNavigation({ waitUntil: 'networkidle2' })

  console.log('笔记发布成功')
}

;(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: false,
    devtools: true,
  })

  const context = browser.defaultBrowserContext()

  const page = await context.newPage()

  let isLoggedIn = await loadCookies(context, page, cookiePath)

  return 
  if (!isLoggedIn) {
    await login(page, context)
    isLoggedIn = true
  }

  if (isLoggedIn) {
    await publishNote(page, '我的测试标题', '这是自动发布的笔记内容', ['/path/to/image1.jpg', '/path/to/image2.jpg'])
  }

  await browser.close()
})()
