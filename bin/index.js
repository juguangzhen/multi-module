#!/usr/bin/env node
const prog = require('caporal')
const { initBackend } = require('../backend/index')
const path = require("path");
const http = require('http')
prog
  .version('1.0.0')
  .command('startServe', 'This is test startServe')
  .option('-c --configPath <configPath>', 'config path')
  .action((args, options, logger) => {
    let { configPath } = options
    const workSpace = process.cwd()
    // path.resolve(workSpace, configPath)返回路径地址
    // TODO  此处可以检查路径是否存在该文件
    const config = require(path.resolve(workSpace, configPath))

    // 实例化服务
    let app = initBackend(config, workSpace)

    app.set('port', config.port)

    const server = http.createServer(app)
    server.listen(config.port)

    server.on('error', (e) => {
      throw e
    })

    server.on('listening', () => {
      console.log(`You app is running on ${JSON.stringify(server.address())}`)
    })

  })
prog.parse(process.argv)
