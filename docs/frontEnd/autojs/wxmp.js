const config = {
  比亚迪王朝: byd,
  冷酸灵乐齿食光: lengsuanling,
  // 屈臣氏: qcs,
  // 瑷尔博士官方云商城: aebs,  // 首屏弹框 待处理
  '白药生活+': bysh // 1200积分换牙膏
}

let runStatus = {}
let taskList = []
let myMpNames = new Set()

const findTime = 5000
const View = 'android.view.View'
startMp()

function startMp() {
  app.launch('com.tencent.mm')
  //检查无障碍服务是否已经启用，如果没有启用则跳转到无障碍服务启用界面，并等待无障碍服务启动；当无障碍服务启动后脚本会继续运行。
  auto.waitFor()

  while (!click('发现'));
  while (!click('小程序'));

  clickBtn('我的小程序', View)
  sleep(2000)
  genderTaskList()
  runTaskList()
}

function getMewxMpNames() {
  console.log('====== 获取到关注的小程序名称: ======')
  myMpNames.clear()
  className('androidx.recyclerview.widget.RecyclerView')
    .findOne()
    .children()
    .forEach((child) => {
      let menuName = child.child(0).text()
      console.log(menuName)
      menuName && myMpNames.add(menuName)
    })
}

function runTaskList() {
  while (taskList.length > 0) {
    let task = taskList.shift()
    try {
      task()
    } catch (error) {
      console.log('run mini task error', error)
    }
  }
  console.log('一轮执行完成')
  toast('一轮执行完成')
}

function genderTaskList() {
  getMewxMpNames()
  Array.from(myMpNames).forEach((name) => {
    if (config[name]) {
      
      taskList.push(genderTask(name))
    }
  })
}

function genderTask(numeName) {
  return function () {
    const itemMenu = className('androidx.recyclerview.widget.RecyclerView')
      .findOne()
      .children()
      .findOne(className('android.widget.TextView').text(numeName))
    clickFun(itemMenu)
    config[numeName]()
    sleep(2000)
    closeMp()
    sleep(2000)
  }
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

  let textView = className(type).text(btnText).findOne(findTime) || className(type).desc(btnText).findOne(findTime)

  if (textView) {
    return textView
  } else {
    console.log('没找到按钮: ', btnText)
  }
}

function clickBtn(btnText, type) {
  const textItem = findOneByName(btnText, type)
  textItem && clickFun(textItem)
}

function clickFun(uiObject) {
  var b = uiObject.bounds()
  click(b.centerX(), b.centerY())
  uiObject.click()
  sleep(3000)
}

function successLog(appName) {
  console.log(`==== ${appName}==== 应用签到成功`)
}

function closeMp() {
  className('android.widget.ImageButton').desc('关闭').findOne().click()
}

function byd() {
  findOneByName('我的').parent().click()
  clickBtn('每日签到')
  successLog('BYD')
}

function lengsuanling() {
  clickBtn('我的')
  clickBtn('签到领积分')
  const bottom = className('android.view.View').depth(7).findOne().parent()
  if (bottom) {
    for (let i = 1; i <= 5; i++) {
      click(device.width / 2, bottom.bounds().top - 20 * i)
      sleep(3000)
    }
  }
  successLog('lengsuanling')
}

function qcs(params) {}

function aebs() {
  clickBtn('我的')
  clickBtn('签到有礼')
  clickBtn('立即签到')
  successLog('lengsuanling')
}

function bysh() {
  clickBtn('个人中心')
  clickFun(findOneByName('常用功能').parent().child(1))
  successLog('白药生活')
}
