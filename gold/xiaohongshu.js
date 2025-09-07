/**
 * 小红书自动发布图片脚本
 * 使用 userDataDir保存Chrome本地数据，避免每次登录
 */

const puppeteer = require('puppeteer-core')
const fs = require('fs')
const path = require('path')

const userDataDir = path.join(__dirname, 'RedbookUserData')
const publishPageUrl = 'https://creator.xiaohongshu.com/publish/publish?source=official&from=menu&target=video'

async function login(page) {
  //   await page.goto(publishPageUrl, { waitUntil: 'networkidle2' });

  // 等待登录框出现，并模拟点击登录按钮（根据实际页面结构调整）
  await page.waitForSelector('div.login-box-container')

  await page.waitForNavigation({ waitUntil: 'networkidle2' })

  console.log('登录成功并已保存用户数据到:', userDataDir)
}

/**
 *
 * @param {puppeteer.Page} page
 * @param {*} title
 * @param {*} content
 * @param {*} imagePaths
 */
async function publishNote(page, title, content, imagePaths) {
  console.log(arguments)

  await page.waitForSelector('#web div.header > div')
  await page.locator('#web div.header > div:last-child').click()
  const fileElement = await page.waitForSelector('#web > div.outarea.upload-c div.upload-wrapper input.upload-input')

  for (const imagePath of imagePaths) {
    await fileElement.uploadFile(imagePath)
  }
  console.log('file uploaded')

  //   输入标题
  await page.locator('.post-page .titleInput input.d-text').fill(title)

  const conentSelector = '#quillEditor .ql-editor'
  await page.type(conentSelector, content + '\n')
  await page.type(conentSelector, '#如意积存金', { delay: 100 })
  await page.locator('#quill-mention-item-0').click()
  await page.type(conentSelector, '#银行黄金', { delay: 100 })
  await page.locator('#quill-mention-item-0').click()
  await page.type(conentSelector, '#银行金价', { delay: 100 })
  await page.locator('#quill-mention-item-0').click()
  await page.type(conentSelector, '#今日金价')
  await page.locator('#quill-mention-item-0').click()

  //   选择合集
  await page.click('.collection-container .d-select')
  await page.waitForSelector('.d-select.focus', { visible: true })
  await page.click(`body > .d-dropdown .d-options .item:first-child`)

  // 发表
  await page.click('.post-page .submit button:first-child')
  await page.waitForNavigation({ waitUntil: 'networkidle2' })

  console.log('笔记发布成功')
}

;(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: false,
    devtools: true,
    defaultViewport: null,
    userDataDir: userDataDir // ✅ 启用用户数据目录自动保存状态
  })

  const page = await browser.newPage()

  await page.goto(publishPageUrl, { waitUntil: 'networkidle2' })

  // 判断是否已经登录（根据页面元素判断）
  const isLoggedIn = page.url().includes('publish/publish') && (await page.$('.name-box')) !== null

  if (!isLoggedIn) {
    console.log('未登录，请手动登录一次')
    await login(page)
  } else {
    console.log('检测到已登录状态')
  }

  // 发布笔记（可选）
  await publishNote(page, '2025-7-14银行金价', '价格有所上升', [path.join(__dirname, '2025-7-14银行金价.png')])

  //   await browser.close();
})()
