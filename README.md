# crawler-element-selector

Crawl elements selector which match specific DOM event.

<img src="https://github.com/posrix/portrayal/blob/master/crawler-element-selector/example.gif" width="500"/>

## Install

```bash
npm install crawler-element-selector --save-dev
```

## Usage

``` js
const crawler = require('./')

crawler([
  'http://baidu.com/',
  'http://zero.webappsecurity.com/'
], {
  eventType: 'click'
})
```

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
