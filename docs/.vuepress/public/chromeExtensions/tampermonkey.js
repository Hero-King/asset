// ==UserScript==
// @name         HeroKing Tampermonkey Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  HeroKing some scripts
// @author       HeroKing
// @include        *
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466261/HeroKing%20Tampermonkey%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/466261/HeroKing%20Tampermonkey%20Userscript.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  const d = document
  const emptyFun = () => {}
  function select(params) {
    return d.querySelector(params)
  }
  function selectAll(params) {
    return d.querySelectorAll(params)
  }
  function removeWebLimit() {
    window.oncontextmenu = window.onkeydown = window.onkeyup = window.onkeypress = d.oncontextmenu = null
  }
  const sleep = (time) => {
    return new Promise((res) => {
      setTimeout(res, time)
    })
  }

  if (location.host == 'mongoosejs.net') {
    let advertise = d.querySelector('#layout .container > div:nth-child(1)')
    advertise.parentElement.removeChild(advertise)
  }
  if (
    location.host === 'www.douyin.com' &&
    location.pathname.includes('/user/MS4wLjABAAAAeIIkCgELXG6XdUxuE9nQ6W4AfS-aoPFbtmnBL8ytcYtBSyurgePBYZXJpB0LJBCT') &&
    location.search.includes('modal_id')
  ) {
    // Inject initial styles
    GM_addStyle(`
        video {
            transform: scale(2);
            transform-origin: center;
        }
    `)
  }

  // wx人社
  if (location.href.startsWith('https://61.160.99.102:8031/WXJXJY')) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        myVid.muted = 'muted'
        myVid.play()
        // 设置倍速
        myVid.playbackRate = 2

        // 播放结束
        myVid.addEventListener('ended', () => {
          setTimeout(() => {
            // location.reload()
          }, 1000 * 5)
        })
      }, 1000 * 2)
    })
  }

  window.addEventListener('load', () => {
    removeAds()
    svoltBasePriceCalc()
  })

  function removeAds() {
    // 去除网页google广告
    const gooads = d.querySelectorAll('ins.adsbygoogle')
    for (let i = 0; i < gooads.length; i++) {
      const ele = gooads[i]
      ele.parentElement.removeChild(ele)
    }
  }

  // 底价专利
  function svoltBasePriceCalc() {
    if (location.href.startsWith('http://10.36.30.83/login')) {
      const h3 = document.querySelector('#app > div > form > h3')
      h3.style.fontSize = '24px'
      h3.style.color = '#000'
      h3.innerText = title
    }
    if (location.href.startsWith('http://10.36.30.83/basepricecalc/pricemanage/index')) {
      let drop = document.querySelector('.sidebar-logo-container > .el-dropdown')
      drop.remove()
      const logoContainer = d.querySelector('.sidebar-logo-container > div')
      logoContainer.removeChild(logoContainer.firstChild)
      let h3 = document.createElement('h3')
      h3.innerText = title
      h3.style.fontSize = '16px'
      h3.style.color = '#FFF'
      logoContainer.appendChild(h3)
    }
  }

  // 处理vue3源码解析: https://boychina.github.io/posts/2020-12-23-vue3-core-source-code-2 网站https加载http图片问题
  if (location.host === 'boychina.github.io') {
    // https网站允许加载http资源
    const oMeta = document.createElement('meta')
    oMeta.content = 'upgrade-insecure-requests'
    oMeta.httpEquiv = 'Content-Security-Policy'
    document.getElementsByTagName('head')[0].appendChild(oMeta)
  }

  if (location.host === 'www.czpx.cn') {
    // 视频时长记录: 进入页面时调用coursePlayServlet.do, 结束后调用savelearnprogressservlet
    // 不能多视频, 多页签同时
    sleep(3000)
      .then(() => {
        console.log('RUnnnnnn')
        window.check = emptyFun
        removeWebLimit()
        if (location.pathname.includes('learnCourseListServlet.do')) {
          let link = Array.from(selectAll('#ul1 table td a')).find((i) => i.innerHTML == '开始学习' && i.id)
          // 跳转到章节列表
          location.href = '/learnCourseChapterServlet.do?' + link.id
          return
        } else if (location.pathname.includes('learnCourseChapterServlet.do')) {
          let link = Array.from(selectAll('#ul1 table td a.orange')).find((i) => i.href.includes('/coursePlayServlet'))
          link.target = '_self'
          link?.click()
          return
        } else if (location.pathname.includes('coursePlayServlet.do')) {
          let video
          let autoAnswerLoading = false
          window.hanadleTime = Number.MAX_SAFE_INTEGER
          const autoPlay = async () => {
            autoAnswer()
            video = select('video')
            let start = select('#mse > xg-start')
            if (!video) {
              start.click()
              await sleep(1500)
              video = select('video')
              if (!video) {
                console.error('自动播放失败')
                start.click()
                video = select('video')
              }
              hanadleTime = isNaN(Date.now() + video.duration * 1000) ? Number.MAX_SAFE_INTEGER : Date.now() + video.duration * 1000
              video.muted = true
            }

            video.addEventListener('loadedmetadata', function () {
              console.log('loadedmetadata')
              hanadleTime = Date.now() + this.duration * 1000
            })

            video.addEventListener('ended', function () {
              console.log('ended')
              hanadleTime = Number.MAX_SAFE_INTEGER
            })
            let retry = 3
            video.addEventListener('error', function () {
              console.log('视频加载失败')
              if (retry > 0) {
                select('#mse .xgplayer-error .xgplayer-error-refresh')?.click()
                retry--
              }
            })
          }

          setInterval(intervalTask, 5000)
          clickIKnow()
          autoPlay()
          window.alert = function (msg) {
            console.info('===== alert =====', msg)
            if (msg.includes('获取出错,请刷新页面重试，谢谢！')) {
              goStudyListAndStu()
            }
          }

          const goStudyListAndStu = async () => {
            const onlineStuList = Array.from(d.querySelectorAll('a')).filter((i) => i.href.includes('learnCourseListServlet.do'))
            onlineStuList && onlineStuList[0].click()
          }

          function intervalTask() {
            autoAnswer()
            clickIKnow()
            manaulEnd()
          }

          /**
           * 执行提交的话间隔1min
           * @returns
           */
          function autoAnswer() {
            const layer = document.getElementById('window')
            if (layer && layer.style.display !== 'none') {
              if (autoAnswerLoading) {
                return
              }
              autoAnswerLoading = true
              setTimeout(() => {
                autoAnswerLoading = false
              }, 1000 * 60)
              const pList = layer.querySelectorAll('p')
              const radioList = layer.querySelectorAll('input[type=radio]')
              let answer = null
              pList.forEach((i) => {
                if (i.align === 'right') {
                  answer = i.innerText.split('：')[1].trim()
                }
              })
              radioList.forEach((i) => {
                if (i.value === answer) {
                  i.click()
                  d.querySelector('div.layui-layer-btn.layui-layer-btn- > a')?.click() && console.log('完成自动答题')
                }
              })
            }
          }

          function clickIKnow() {
            const list = Array.from(d.querySelectorAll('.layui-layer-title')).filter((i) => i.innerHTML.includes('视频播放提示'))
            if (list && list.length > 0) {
              const btns = d.querySelectorAll('.layui-layer.layui-layer-dialog div.layui-layer-btn > a')
              Array.from(btns)
                .filter((i) => i.innerHTML.includes('知道了'))[0]
                .click()
            }
          }

          function manaulEnd() {
            if (Date.now() > hanadleTime + 1000 * 5) {
              video.dispatchEvent(new Event('ended'))
              console.log(video.src, '=====')
            }
          }
        }
      })
      .catch((error) => {
        console.error(error)
        error = error.message ?? error
        if (error.includes('click')) {
          $.post('http://www.pushplus.plus/send', { token: localStorage.getItem('pushToken'), title: '视频脚本错误, 请检查', content: error })
          setTimeout(() => {
            location.reload()
          }, 1000 * 60)
        }
      })
  }
})()
