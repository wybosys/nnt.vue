const fs = require('fs')
const path = require('path')

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

function GenRoutes(srcdir, outputfile) {
  // 默认输出到src/router/index.ts中
  // 默认组件保存在src/components中

  // { path: filepath }
  let routes = {}

  // 列出所有目录中的组件
  ListRoutesInDirectory('src/' + srcdir, '', routes)

  let imports = []
  let defs = []

  for (let key in routes) {
    let name = key.replace(/\//g, '_')
    imports.push('const ' + name + ' = () => import("../components' + routes[key] + '")')
    defs.push("\t{\n\t\tpath: '" + key + "',\n\t\tcomponent: " + name + ",\n\t\tname: '" + name + "'\n\t}")
  }

  // 如果是二级目录，则需要生成额外的router
  if (fs.existsSync('devops.json')) {
    let devops = JSON.parse(fs.readFileSync('devops.json'))
    let path = devops.path.substr(15)
    for (let key in routes) {
      let name = key.replace(/\//g, '_')
      key = path + key
      defs.push("\t{\n\t\tpath: '" + key + "',\n\t\tcomponent: " + name + ",\n\t\tname: 'devops" + name + "'\n\t}")
    }
  }

  content = imports.join('\n')
  content += '\n\n'
  content += 'export default [\n'
  content += defs.join(',\n')
  content += '\n]\n'

  // 保存
  fs.writeFileSync('src/router/' + outputfile + '.ts', content)
}

function UppercaseFirst(str) {
  if (!str || str.length == 0)
    return str
  return str[0].toUpperCase() + str.substr(1)
}

function ListRoutesInDirectory(dir, cur, result) {
  let cfg = dir + '/config.json'
  if (fs.existsSync(cfg)) {
    let cfgobj = JSON.parse(fs.readFileSync(cfg))
    let rootname = UppercaseFirst(path.basename(cur))
    if (fs.existsSync(dir + '/' + rootname + '.vue')) {
      result[cur] = cur + '/' + rootname + '.vue'
      if (cfgobj.default) {
        result[path.dirname(cur)] = cur + '/' + rootname + '.vue'
      }
    }
  }

  fs.readdirSync(dir).forEach(each => {
    let st = fs.statSync(dir + '/' + each)
    if (st.isDirectory()) {
      ListRoutesInDirectory(dir + '/' + each, cur + '/' + each, result)
    } else {
      if (path.extname(each) == ".vue") {
        let name = path.basename(each, ".vue").toLowerCase()
        result[cur + '/' + name] = cur + '/' + each
      }
    }
  })
}

function GenSites() {

}

if (process.argv.indexOf('stop') != -1) {
  StopDevServer()
} else if (process.argv.indexOf('routes') != -1) {
  GenRoutes('components', 'routes')
} else if (process.argv.indexOf('sites') != -1) {
  GenSites()
}

module.exports = {
  StopDevServer,
  SaveDevServer
}
