var system = require('system')
var page = require('webpage').create()

var url = system.args[1]
var options = JSON.parse(system.args[2])

page.settings.loadImages = false
page.settings.localToRemoteUrlAccessEnabled = true
page.settings.resourceTimeout = 15000

page.onError = function(msg, trace) {
  console.log(msg)
  phantom.exit()
}

page.onInitialized = function() {
  page.evaluate(function() {
    Element.prototype._addEventListener = Element.prototype.addEventListener
    Element.prototype.addEventListener = function(a, b, c) {
      this._addEventListener(a, b, c)
      if (!this.eventListenerList) this.eventListenerList = {}
      if (!this.eventListenerList[a]) this.eventListenerList[a] = []
      this.eventListenerList[a].push(b)
    }
  })
}

page.open(url, function(status) {
  var output = page.evaluate(
    function(getEventElement, eventType, output) {
      getEventElement(document, eventType, output)
      return output
    },
    getEventElement,
    options.eventType,
    []
  )
  output.forEach(function(selector) {
    console.log(selector)
  })
  phantom.exit()
})

function getEventElement(node, eventType, output) {
  for (var i = 0; i < node.childNodes.length; i++) {
    var child = node.childNodes[i]
    arguments.callee(child, eventType, output)
    if (child.eventListenerList && child.eventListenerList[eventType]) {
      var path = ''
      for (; child && child.nodeType == 1; child = child.parentNode) {
        var inner = $(child).children().length == 0 ? $(child).text() : ''
        var eleSelector =
          child.tagName.toLowerCase() +
          (inner.length > 0 ? ":contains('" + inner + "')" : '')
        path = ' ' + eleSelector + path
      }
      output.push(path)
    }
  }
}
