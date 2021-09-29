const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const Logger = require('../logger')
const { isFunction } = require('./util')
const createDistRouter = require('./dist-router')
const createProxyRouter = require('./proxy-router')

module.exports = (config, rootPath, app) => {
  app = app || express()

  const logger = new Logger(config)

  app.disable('x-powered-by')
  app.enable('trust proxy');

  if(config.before && isFunction(config.before)) {
    config.before(app)
  }

  app.use(
    bodyParser.urlencoded({
      limit: '100mb',
      extended: true
    })
  )
  app.use(
    bodyParser.json({
      limit:  '100mb'
    })
  )

  const proxyRouter = createProxyRouter(config.proxies, logger)
  app.use(proxyRouter)

  app.get('/', (req, res) => {
    res.sendFile(path.join(rootPath, config.dist));
    // res.send('hello world')
  })

  const distRouter = createDistRouter(config.dist, rootPath)
  app.use(distRouter)

  if(config.after && isFunction(config.after)) {
    config.after(app)
  }

  return app
}
