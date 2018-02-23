const crawler = require('./')

crawler([
  'http://baidu.com/',
  'http://zero.webappsecurity.com/'
], {
  eventType: 'click'
})
