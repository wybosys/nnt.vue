const fs = require('fs')

function StopDevServer() {
  if (fs.existsSync('run/dev-server.pid')) {
    let buf = fs.readFileSync('run/dev-server.pid')
    let pid = buf.toString()
    try {
      process.kill(parseInt(pid))
    } catch (err) {
    }
    fs.unlinkSync('run/dev-server.pid')
  }
}

function SaveDevServer() {
  if (!fs.existsSync('run'))
    fs.mkdirSync('run')
  fs.writeFileSync('run/dev-server.pid', process.pid)
}

function GenRoutes() {
  // 默认输出到src/router/index.ts中

}

if (process.argv.indexOf('stop') != -1) {
  StopDevServer()
} else if (process.argv.indexOf('routes') != -1) {
  GenRoutes()
}

module.exports = {
  StopDevServer,
  SaveDevServer
}
