const puppeteer = require('puppeteer-core')
var template = require('art-template')
const path = require('path')

var fs = require('fs')
const resultHtmlPath = __dirname + '/gold.html'
const date = new Date()
const toDay = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
const pngFilePath = path.join(__dirname, `./${toDay}银行金价.png`)

const userDataDir = path.join(__dirname, 'RedbookUserData')
const publishPageUrl = 'https://creator.xiaohongshu.com/publish/publish?source=official&from=menu&target=video'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
/**
 * @type {puppeteer.Browser}
 */
let browser
const main = async () => {
  try {
    browser = await puppeteer.launch({
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      headless: false,
      devtools: false,
      defaultViewport: { width: 1920, height: 1080 }, // 设置初始窗口大小
      userDataDir: userDataDir // ✅ 启用用户数据目录自动保存状态
    })

    const page = await browser.newPage()
    await page.setDefaultTimeout(10000) // 设置默认超时时间为10秒

    // 使用辅助函数安全地获取元素文本
    async function getElementText(selector) {
      const element = await page.$(selector)
      if (!element) return 'N/A'
      return await element.evaluate((el) => el.textContent.trim() || 'N/A')
    }

    // const ccb = await getCcbData()
    // const icbc = await getIcbcData()
    // const cmb = await getCmbData()
    // const dataList = [].concat(ccb, icbc, cmb)
    // // console.log(dataList, 'dataList')
    // renderTemplate({ dataList, date: toDay })
    // await screenshotContainer(`file://${resultHtmlPath}`, '.container')
    // fs.writeFileSync(__dirname + `/${toDay}银行金价.json`, JSON.stringify(dataList, null, 2))
    await sendRedBook(page, `${toDay}银行金价来了~`)

    function getCommonFields(bank, product) {
      return {
        date: toDay,
        bank,
        product,
        regularBuyPrice: '-',
        sellPrice: '-'
      }
    }

    async function getCcbData() {
      // 导航到页面并等待加载完成
      await page.goto('https://ccb.com/chn/home/gold_new/gjssy/index.shtml', {
        waitUntil: 'networkidle2' // 等待网络请求基本完成
      })
      // 等待关键元素加载
      await page.waitForSelector('#initiativeBuyPrice', { visible: true })
      const buyPriceText = await getElementText('#initiativeBuyPrice')
      const sellPriceText = await getElementText('#initiativeSellPrice')
      const regularBuyPriceText = await getElementText('#regularBuyPrice')

      await page.goto('https://ccb.com/chn/home/gold_new/cpjs/swgjs/flsx/index.shtml?toLink=swgjs_list', {
        waitUntil: 'networkidle2' // 等待网络请求基本完成
      })
      const search = await page.locator('#swgjs_list  div.fenlei_choose input[type=text]')
      await search.fill('投资金条50')
      await page.locator('#swgjs_ss').click()
      await sleep(1500)
      const physicalPriceText = await getElementText('#product-list > div > ul > li > h3')

      return [
        {
          ...getCommonFields('建设银行', '主动积存'),
          buyPrice: buyPriceText,
          sellPrice: sellPriceText,
          regularBuyPrice: regularBuyPriceText
        },
        {
          ...getCommonFields('建设银行', '投资金条'),
          buyPrice: parseFloat(physicalPriceText.replace('￥', ''))
        }
      ]
    }

    async function getIcbcData() {
      await page.goto('https://mybank.icbc.com.cn/icbc/newperbank/perbank3/gold/goldaccrual_query_out.jsp', {
        waitUntil: 'networkidle2' // 等待网络请求基本完成
      })
      const buyPriceText = await getElementText('#activeprice_080020000521')
      const sellPriceText = await getElementText('#regprice_080020000521')
      const regularBuyPriceText = await getElementText('#sellprice_080020000521')
      const ruyiBuyPriceText = await getElementText('#activeprice_080020000501')
      const ruyiSellPriceText = await getElementText('#sellprice_080020000501')
      return [
        {
          ...getCommonFields('工商银行', '主动积存'),
          buyPrice: buyPriceText,
          sellPrice: sellPriceText,
          regularBuyPrice: regularBuyPriceText
        },
        {
          ...getCommonFields('工商银行', '如意金积存'),
          buyPrice: ruyiBuyPriceText,
          sellPrice: ruyiSellPriceText
        }
      ]
    }

    async function getCmbData() {
      await page.goto('https://gold.cmbchina.com/Products/ProductDetail?PrdCode=FJ088GLD9002K0010', {
        waitUntil: 'networkidle2' // 等待网络请求基本完成
      })
      const buyPriceText = await getElementText('.innerContainer .priceTag')
      return [
        {
          ...getCommonFields('招商银行', '投资金条'),
          buyPrice: (buyPriceText.replace(',', '') / 10).toFixed(2)
        }
      ]
    }

    async function screenshotContainer(file, selector) {
      // 使用 file:// 协议打开文件
      await page.goto(file)

      // 获取元素句柄
      const element = await page.$(selector)
      // 截取元素并保存为 PNG
      await element.screenshot({ path: pngFilePath })
    }
  } catch (error) {
    console.error('抓取过程中出现错误:', error)
    // 确保浏览器总是关闭
  } finally {
    if (browser) {
      browser.close()
    }
  }
}

main()

function renderTemplate(data) {
  var html = template(__dirname + '/goldTemplate.art', data)

  fs.writeFileSync(resultHtmlPath, html)
}

// 小红书发布

async function sendRedBook(page, title) {
  await page.goto(publishPageUrl, { waitUntil: 'networkidle2' })

  // 判断是否已经登录（根据页面元素判断）
  const isLoggedIn = page.url().includes('publish/publish') && (await page.$('.name-box')) !== null

  if (!isLoggedIn) {
    console.log('未登录，请手动登录一次')
    await login(page)
  } else {
    console.log('检测到已登录状态')
  }

  await publishNote(page, title, '银行金价每日收集', [pngFilePath])
}

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
  await page.waitForSelector('#web div.header > div')
  await page.locator('#web div.header > div:nth-child(3)').click()
  const fileElement = await page.waitForSelector('#web > div.outarea.upload-c div.upload-wrapper input.upload-input')

  for (const imagePath of imagePaths) {
    await fileElement.uploadFile(imagePath)
  }
  console.log('file uploaded')

  //   输入标题
  await page.locator('.post-page .title-container input.d-text').fill(title)

  const conentSelector = '.edit-container .editor-content'
  const tipSelector = '#creator-editor-topic-container .item:first-child'
  await page.locator(conentSelector).click()
  await page.type(conentSelector, content + '\n')
  await page.type(conentSelector, '#如意积存金', { delay: 100 })
  await page.locator(tipSelector).click()
  await page.type(conentSelector, '#银行黄金', { delay: 100 })
  await page.locator(tipSelector).click()
  await page.type(conentSelector, '#银行金价', { delay: 100 })
  await page.locator(tipSelector).click()
  await page.type(conentSelector, '#今日金价')
  await page.locator(tipSelector).click()

  //   选择合集
  await page.click('.collection-container .d-select')
  await page.waitForSelector('.d-select.focus', { visible: true })
  await page.click(`body > .d-dropdown .d-options .item:first-child`)

  // 发表
  await page.click('.post-page .submit button:first-child')
  await page.waitForNavigation({ waitUntil: 'networkidle2' })

  console.log('笔记发布成功')
}
