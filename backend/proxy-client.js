const Client = require('../client')

const upperCaseFirst = (content) => content.replace(/[a-z]|-[a-z]/g, (d) => d.toUpperCase()) // header参数 首字母转大写

module.exports = (baseUrl, options, logger) => {

  console.log(baseUrl, options, 'baseUrl')
  let clientReq = new Client(baseUrl)
  return (req, res) => {
    // req.url  req.query get请求参数
    let config = {}
    config.method = req.method.toUpperCase()
    config.url = req.params[0]
    switch (config.method) {
      case 'GET':
      case 'DELETE':
        config.params = req.query
        break
      case 'POST':
      case 'PUT':
        config.params = req.query
        config.data = req.body
        if (!req.headers['content-type']) {
          req.headers['content-type'] = 'application/json'
        }
        break
      default:
        return res.json(
          new Error(`Method: ${config.method} is Not Allowed!`),
        )
    }

    let proxyInfoHeader = {} // TODO 需要透传的header参数 cong req中获取
    // cookie content-type accept-language

    let userInfoHeader = {} // TODO 用户信息header 如果用户登录了，可以取出对应参数 放到该字段

    config = {
      ...config,
      headers: {
        ...(config.headers || {}),
        // 可以指定header字段
        ...proxyInfoHeader,
        ...userInfoHeader
      }
    }

    // TODO 处理请求是文件的情况  req.file
    logger.info('This is a logger')
    clientReq._request(config).then(response => {
      // TODO logger
      logger.info('Success request~!')
      res.json({ data: response.data })
    }).catch(err => {
      // TODO logger
      console.log(err)
    })
  }
}
