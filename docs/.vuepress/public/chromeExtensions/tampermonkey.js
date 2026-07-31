// ==UserScript==
// @name         HeroKing Tampermonkey Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1.13
// @description  HeroKing some scripts
// @author       HeroKing
// @match        *://*/*
// @grant        GM_cookie
// @grant        GM_info
// @grant        GM_addStyle     
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466261/HeroKing%20Tampermonkey%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/466261/HeroKing%20Tampermonkey%20Userscript.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  const d = document
  function removeWebLimit() {
    window.oncontextmenu = window.onkeydown = window.onkeyup = window.onkeypress = d.oncontextmenu = null
  }
  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? decodeURIComponent(match[2]) : null
  }
  function findVueInstance(element) {
    if (element.__vue__) {
      return element.__vue__.$root.constructor
    }
    for (let i = 0; i < element.children.length; i++) {
      const childVue = findVueInstance(element.children[i])
      if (childVue) return childVue
    }
    return null
  }
  const sleep = (time) => {
    return new Promise((res) => {
      setTimeout(res, time)
    })
  }

  // 设置127.0.0.1的ticket字段 与dsim平台一致
  if (location.host.match(/dsim.*\-api/)) {
    const ticket = getCookie('ticket')
    if (ticket) {
      GM_cookie.set({
        url: 'http://127.0.0.1', // 必须带协议
        name: 'ticket',
        value: ticket,
        domain: '127.0.0.1',
        path: '/',
        secure: false, // 127.0.0.1 是 http，不能用 secure
        httpOnly: false, // 必须 false，JS 才能读取
        expirationDate: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 // 7天后过期
      })
    }
  }

  // 去除OE 用例textarea禁用
  if (location.href.includes('/biz/1460/requirement/metersphere/track/plan')) {
    GM_addStyle(`
      textarea[disabled] {
        cursor: auto !important;
        pointer-events: auto !important;
      }
    `)
  }
  if (location.hostname === '127.0.0.1') {
    setTimeout(() => {
      const rootElement = document.getElementById('app') || document.body
      window.vueConstructor = findVueInstance(rootElement)
      if (window.vueConstructor) {
        window.__VUE_DEVTOOLS_GLOBAL_HOOK__?.emit('init', vueConstructor)
        window.__VUE_DEVTOOLS_MANUALLY_INITIALIZED__ = true
        console.log('✅ Vue DevTools initialized using Vue instance constructor')

        // 拦截 console.error，过滤掉 Vue key重复的错误
        const originalConsoleError = console.error
        console.error = function (...args) {
          const errorMsg = args.join(' ')
          if (errorMsg.includes('Duplicate keys') || errorMsg.includes('重复的 key') || errorMsg.includes('[Vue warn]: Duplicate')) {
            console.warn.apply(console, args)
            return
          }
          originalConsoleError.apply(console, args)
        }
      }
      return
    }, 5000)
  }

  if (location.host == 'mongoosejs.net') {
    let advertise = d.querySelector('#layout .container > div:nth-child(1)')
    advertise.parentElement.removeChild(advertise)
  }
  // PC打开抖音网站时 视频放大一倍
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
  })

  function removeAds() {
    // 去除网页google广告
    const gooads = d.querySelectorAll('ins.adsbygoogle')
    for (let i = 0; i < gooads.length; i++) {
      const ele = gooads[i]
      ele.parentElement.removeChild(ele)
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

  if (location.host === 'dsim.intra.didiglobal.com') {
    const getServiceList = (params) => {
      const queryString = new URLSearchParams(params).toString()
      return fetch(`http://dsim.intra.didiglobal.com/api/envmanager/detail/getServiceList?${queryString}`, {
        body: null,
        method: 'GET'
      }).then((res) => res.json())
    }

    const getPackageList = (params) => {
      const queryString = new URLSearchParams(params).toString()
      return fetch(`http://dsim.intra.didiglobal.com/api/envmanager/services/queryPackageList?${queryString}`, {
        body: null,
        method: 'GET',
        mode: 'cors',
        credentials: 'include'
      }).then((res) => res.json())
    }

    const checkDeploy = (body) => {
      return fetch('http://dsim.intra.didiglobal.com/api/deploy/checkDeploy', {
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(body),
        method: 'POST',
        mode: 'cors',
        credentials: 'include'
      }).then((res) => res.json())
    }

    const deploy = (body) => {
      return fetch('http://dsim.intra.didiglobal.com/api/deploy/batchDeploy', {
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(body),
        method: 'POST',
        mode: 'cors',
        credentials: 'include'
      }).then((res) => res.json())
    }

    const dsimDeploy = async (env, branch, usn = 'fintech-fe-b-tech-global_pixiu_web') => {
      const bizLine = 0
      const serviceListRes = await getServiceList({
        bizLine,
        env,
        pageNum: 1,
        pageSize: 10,
        usn
      })
      const deployInfo = {
        bizLine,
        env,
        branch,
        usn
      }
      const webServiceInfo = serviceListRes.code == 0 ? serviceListRes.data.list[0] : null
      const params = JSON.parse(JSON.stringify(deployInfo))
      if (webServiceInfo) {
        if (webServiceInfo.defaultBranch !== branch) {
          console.log(`当前分支为${webServiceInfo.defaultBranch},将切换到${branch}`)
        }
        const packageListRes = await getPackageList(params)
        if (packageListRes.code == 0) {
          const packageInfo = packageListRes.data.packageLists[0]
          deployInfo.services = [
            {
              usn,
              branch,
              lightweightDeploy: false,
              serviceId: webServiceInfo.serviceId,
              serviceType: webServiceInfo.serviceType,
              ...packageInfo
            }
          ]
          //   存在新的部署包
          if (packageInfo.commit !== webServiceInfo.defaultCommit) {
            console.log(`存在新的部署包, 详情:${packageInfo.commit}, 将进行部署`)
            const checkRes = await checkDeploy(deployInfo)
            if (checkRes.code == 0) {
              const deployRes = await deploy(deployInfo)
              if (deployRes.code == 0) {
                console.log('部署成功')
              } else {
                console.error('部署失败')
              }
            } else {
              console.error('部署检查失败')
            }
          } else {
            console.log('无新的部署包')
          }
        }
      } else {
        console.error('USN 不存在')
      }
    }

    window.dsimDeploy = dsimDeploy
  }
})()
