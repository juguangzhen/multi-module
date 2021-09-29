const express = require('express')
const proxyClient = require('./proxy-client')

module.exports = (proxies, logger) => {
  const proxyOptions = (options) => {
    const {appInfo = {}} = options
    return {
      appInfo,
      logger: logger,
      logLimit: 50000,
      needSign: true,
      beforeRequest(config) {
        // logger
        return config;
      },
      ...options
    }
  }

  const router = new express.Router()
  console.log(proxies, 'proxies')
  Object.keys(proxies).forEach(key => {
    let proxyConfig = proxies[key]
    if(typeof proxyConfig === 'string') {
      proxyConfig = {
        url: proxyConfig,
        signType: 'sha256',
      }
    }

    const { option = {} } = proxyConfig
    let urlPrefix = `/${key}/*`

    router.use(urlPrefix, proxyClient(proxyConfig.url, option, logger))

  })
  return router
}
