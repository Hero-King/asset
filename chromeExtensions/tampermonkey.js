// ==UserScript==
// @name         HeroKing Tampermonkey Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  HeroKing some scripts
// @author       HeroKing
// @include        *
// @grant        none
// @license      MIT
// ==/UserScript==

;(function () {
  'use strict'

  console.log('HeroKing scripts run')

  const d = document

  if (location.host == 'mongoosejs.net') {
    let advertise = d.querySelector('#layout .container > div:nth-child(1)')
    advertise.parentElement.removeChild(advertise)
  }

  // 无锡人社
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
})()
