module.exports = {
  name: 'test_name',
  env: 'dev',
  team: 'test_team',
  project: 'test_project',
  port: '8090',
  dist: './',
  logPath: './log',
  before: function() {
    console.log('This is before hook')
  },
  proxies: {
    juHe: {
      url: 'http://apis.juhe.cn/',
      signType: 'sha256',
      option: {
        beforeRequest: (config) => { // 请求发送前的钩子
          console.log(`this is request before${config}`)
        }
      }
    }
  }
}
