module.exports = {
  name: 'test_name',
  env: 'dev',
  team: 'test_team',
  project: 'test_project',
  port: '8090',
  dist: './',
  logPath: './log',
  before: function() { // 钩子函数 同理可加after钩子
    console.log('This is before hook')
  },
  proxies: { // 代理相关接口 接口加签都在此处统一处理 甚至接口埋点也可以在此处
    juHe: {
      url: 'http://apis.juhe.cn/',
      signType: 'sha256',
      option: {
        beforeRequest: (config) => { // 请求发送前的钩子
          console.log(`this is request before${config}`)
        }
      }
    }
  },
  logConfig: { // 日志相关设置

  }
}
