const axios = require('axios')

const defaultOption = {
  contentType: 'application/json'
}

module.exports = class BaseClient {
  constructor(baseUrl, options) {
    this.config = {
      ...defaultOption,
      ...options
    }
    this.baseUrl = baseUrl
    this._axios = axios.create({
      timeout: 10 * 1000,
      responseType: 'json'
    })
  }
  // 可以在此处统一加签
  getSign(config) {
  }

  // 请求
  _request(config) {
    const { url, method, header = {} } = config
    config.url = this.baseUrl + url
    return this._axios(config)
  }

  get(url, data, options) {
    return this._request(
      Object.assign(
        {
          url,
          method: 'POST',
          data: data,
        },
        options
      )
    )
  }

  post(url, data, options) {
    return this._request(
      Object.assign(
        {
          url,
          method: 'POST',
          data: data,
        },
        options
      )
    )
  }
}
