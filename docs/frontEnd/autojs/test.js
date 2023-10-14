const config = {
  //   比亚迪王朝: byd
  //   冷酸灵乐齿食光: lengsuanling,
  //   屈臣氏: qcs,
  瑷尔博士官方云商城: aebs,
  白药生活: bysh
}

const findTime = 5000
const View = 'android.view.View'
startMp()

function startMp() {
  app.launch('com.tencent.mm')
  //检查无障碍服务是否已经启用，如果没有启用则跳转到无障碍服务启用界面，并等待无障碍服务启动；当无障碍服务启动后脚本会继续运行。
  auto.waitFor()
  //   className('android.widget.TextView').text('发现').findOne().click()
  //   className("android.widget.TextView").text("小程序").findOne().click()

  while (!click('发现'));
  while (!click('小程序'));

  clickBtn('我的小程序', View)
  sleep(2000)
  runTasks()
}

function waitForSelector(selector) {
  selector.waitFor()
  return selector
}

/**
 *
 * @param {string} btnText
 * @returns {Object} uiobject
 */
function findOneByName(btnText, type) {
  type = type || 'TextView'
  return className(type).text(btnText).findOne(findTime) || className(type).desc(btnText).findOne(findTime)
}

function clickBtn(btnText, type) {
  const textItem = findOneByName(btnText, type)
  clickFun(textItem)
}

function clickFun(uiObject) {
  uiObject.click()
  var b = uiObject.bounds()
  click(b.centerX(), b.centerY())
}

function successLog(appName) {
  console.log(`==== ${appName}==== 应用签到成功`)
}

function closeMp() {
  className('android.widget.ImageButton').desc('关闭').findOne().click()
}

function runTasks() {
  Object.keys(config).forEach((key) => {
    className('androidx.recyclerview.widget.RecyclerView')
      .findOne()
      .children()
      .forEach((child) => {
        const itemMenu = child.findOne(className('android.widget.TextView').textStartsWith(key))
        if (itemMenu) {
          clickFun(itemMenu)
          config[key]()
          sleep(1000)
          //   closeMp()
        } else {
          console.log('未找到小程序')
        }
      })

    console.log('test')
  })
}

function byd() {
  waitForSelector(className('android.widget.TextView').text('我的')).findOne().parent().click()
  waitForSelector(className('android.widget.TextView').text('每日签到')).findOne().click()
  successLog('BYD')
}

function lengsuanling() {
  waitForSelector(className('android.widget.TextView').text('我的')).findOne().click()
  waitForSelector(className('android.widget.TextView').text('签到领积分')).findOne().click()
  successLog('lengsuanling')
}

function qcs(params) {}

function aebs() {
  waitForSelector(className('android.widget.TextView').text('我的')).findOne().click()
  waitForSelector(className('android.widget.TextView').text('签到有礼')).findOne().click()
  className('android.widget.TextView').text('立即签到').findOnce().click()
  successLog('lengsuanling')
}

function bysh(params) {
  waitForSelector(className('android.widget.TextView').text('个人中心')).findOne().click()
  waitForSelector(className('android.widget.TextView').text('七天签到')).findOne().click()
  successLog('白药生活')
}
