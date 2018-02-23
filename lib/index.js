const path = require('path')
const fs = require('fs')
const ora = require('ora')
const phantom = require('phantomjs-prebuilt')
const { execFile } = require('child_process')

module.exports = (urls, options) => {
  Promise.all(
    urls.map(
      url =>
        new Promise((resolve, reject) => {
          const oraTextTemplate = status =>
            status
              ? `[${options.eventType}] Crawling Url ${status}: ${url}`
              : `[${options.eventType}] Crawling Urls...`

          const spinner = ora(oraTextTemplate()).start()

          const phantomArguments = [
            path.join(__dirname, './phantomRender.js'),
            url,
            JSON.stringify(options)
          ]

          execFile(
            phantom.path,
            phantomArguments,
            { maxBuffer: 1048576 },
            (error, stdout, stderr) => {
              if (error || stderr) {
                spinner.fail(oraTextTemplate('Failed'))
                if (error) throw stdout
                if (stderr) throw stderr
              } else {
                const prune = url.replace(/\//g, '').replace(/\:/g, '_')
                fs.writeFile(path.resolve(__dirname, `../dist/__${prune}__.txt`), stdout, error => {
                  if (error) {
                    spinner.fail(oraTextTemplate('Failed'))
                    return reject(
                      'Could not write file: ' + url + '\n' + error
                    )
                  }
                  spinner.succeed(oraTextTemplate('Successful'))
                  resolve()
                })
              }
            }
          )
        })
    )
  )
    .catch(error => {
      setTimeout(() => {
        throw error
      })
    })
}
