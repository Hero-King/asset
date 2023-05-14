// ==UserScript==
// @name         HeroKing Tampermonkey Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  HeroKing some scripts
// @author       HeroKing
// @include        *
// @grant        none
// @license      MIT
// ==/UserScript==

;(function () {
  'use strict'

  console.log('HeroKing scripts run');

  const d = document
  if (location && location.host.includes('localhost:')) {
    sessionStorage.setItem('limitSize', 15000)
  }

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
            location.reload()
          }, 1000 * 5)
        })
      }, 1000 * 2)
    })
  }

})()
