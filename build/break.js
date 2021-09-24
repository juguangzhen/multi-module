const readline = require('readline')
const log = console.log
const chalk = require('chalk')
const execSync = require('child_process').execSync
const ora = require('ora')
let spinner = ora('')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const recursiveAsyncReadLine = function() {
  log(chalk.red('Replace local sub module ? (Y/N)'))
  log(chalk.blue('Y: npm run loadSubModules, N: npm run dev'))

  rl.question('Input: ', function(answer) {
    if(answer === 'Y') {
      execSync('npm run loadSubModules', { stdio: [0, 1, 2] })
      return rl.close()
    }
    if(answer === 'N') {
      return rl.close()
    }
    recursiveAsyncReadLine() // 如果输入不符合预期，无法向下执行
  })
}

recursiveAsyncReadLine()
