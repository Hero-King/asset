;(function () {
  'use strict'
  console.log('111111111111')
  const d = document
  if (location && location.host.includes('localhost:')) {
    sessionStorage.setItem('limitSize', 15000)
  }

  if (location.host == 'mongoosejs.net') {
    let advertise = d.querySelector('#layout .container > div:nth-child(1)')
    advertise.parentElement.removeChild(advertise)
  }
  // Your code here...
})()
