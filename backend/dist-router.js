const express = require('express')
const path = require("path");

module.exports = (distConfig, workSpace) => {
  if(typeof distConfig === 'string') {
    distConfig = [{
      path: distConfig,
      match: '/',
      type: 'static',
    }]
  }

  const router = express.Router()

  distConfig.forEach((config) => {
    switch (config.type) {
      case "static":
        router.use(config.match,
          express.static(path.resolve(workSpace, config.path), {
            setHeaders(res, path, state) {
            // TODO 设置缓存？
            }
          })
          )
        break
      case "html":
        router.use(config.match, (req, res) => {
          // TODO 设置缓存？
          res.sendFile(path.join(workSpace, config.path));
        })
        break
    }
  })
  return router
}
