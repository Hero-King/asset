const puppeteer = require('puppeteer-core')
var template = require('art-template')
var fs = require('fs')
const resultHtmlPath = __dirname + '/gold.html'
const date = new Date()
const toDay = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

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
      defaultViewport: { width: 1920, height: 1080 } // 设置初始窗口大小
    })

    const page = await browser.newPage()
    await page.setDefaultTimeout(60000) // 设置默认超时时间为60秒

    // 使用辅助函数安全地获取元素文本
    async function getElementText(selector) {
      const element = await page.$(selector)
      if (!element) return 'N/A'
      return await element.evaluate((el) => el.textContent.trim() || 'N/A')
    }

    const ccb = await getCcbData()
    const icbc = await getIcbcData()
    const cmb = await getCmbData()
    const dataList = [].concat(ccb, icbc, cmb)
    console.log(dataList, 'dataList')
    renderTemplate({ dataList, date: toDay })
    await screenshotContainer(`file://${resultHtmlPath}`, '.container')
    fs.writeFileSync(__dirname + `/${toDay}银行金价.json`, JSON.stringify(dataList, null, 2))
    // sendRedBook()

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
      const physicalPriceText = await getElementText('#physicalPreciousMetalList div.txt > h3')

      return [
        {
          ...getCommonFields('建设银行', '主动积存'),
          buyPrice: buyPriceText,
          sellPrice: sellPriceText,
          regularBuyPrice: regularBuyPriceText
        },
        {
          ...getCommonFields('建设银行', '投资金条'),
          buyPrice: physicalPriceText.replace('￥', '')
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
      await element.screenshot({ path: __dirname + `/${toDay}银行金价.png` })
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