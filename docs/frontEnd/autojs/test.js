const findTime = 3000

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
  console.log('click', b)
  uiObject.click()
  sleep(3000)
}

// scrollDown()
// clickBtn('我的')
// clickBtn('签到领积分')

// console.log(findOneByName("已累计签到").bounds());
// clickBtn('七天签到', 'Button')
