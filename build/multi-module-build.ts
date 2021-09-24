/**
 * @author: guangzhen.ju.o
 * @date: 16/06/2021 15:14
 * */
import path = require('path')
import chalk = require('chalk')
import rm = require('rimraf')
import * as fs from "fs"
import simpleGit from 'simple-git'

const git = simpleGit()

const generateFunction = require('./handler-template-router')
const generateScssFunction = require('./handler-template-generator-style')

const submodules = require('../sub_module_config.json').modules

interface Module {
  name: string,
  repository: string
  branch: string
}

let jsImports = '', routersArg = 'routers', cssImports = '', storeImports = '', storesArg = 'stores',
  moduleCount = 0, completeCount = 0
let routers = `
  let ${routersArg} = []`,
  stores = `
  let ${storesArg} = {}`

const SUBMODULE_DIR = '../subModules'



function cloneModule(module: Module, cb: Function): void {
  let repository = module.repository
  let branch = module.branch || 'master'
  let dir = path.resolve(__dirname, SUBMODULE_DIR + '/' + module.name)
  git.clone(repository, dir, {}, err => {
    err && console.error(err)
  }).cwd(dir).checkout(branch, {}, err => {
    if(err) throw err
    
    console.log(chalk.blue([branch, 'done: ', repository, '\n'].join(' ')))
    
    cb && cb(module)
  })
}
// 处理路由 CSS Store 等
function generateIndexJs(fileContent: any, cb?: Function): void {
  fs.writeFile(path.resolve(__dirname, '../subModules/index.js'), fileContent, function (err) {
    if(err) throw err
    
    console.log(chalk.blue('generate index.js! \n'))
    
    cb && cb()
  })
}

function generateIndexStyle (fileContent: any, cb?: Function): void {
  fs.writeFile(path.resolve(__dirname, '../subModules/indexStyle.scss'), fileContent, function (err) {
    if (err) {
      throw err
    }
    console.log(chalk.blue('generated indexStyle.scss!\n'))
    cb && cb()
  })
}


// 主函数 核心

function cloneSubModule(modules: Module[]) {
  try {
    for(let module of modules) {
      cloneModule(module, (module: Module) => {
        
        jsImports += `
  import ${module.name} from './${module.name}'`
        routers += `
  ${routersArg}.push(${module.name})`
        
        if(fs.existsSync(path.resolve(__dirname, `../subModules/${module.name}/src/scss`))) { // 如果该目录下有scss文件， 才会执行
          cssImports += `
  @import './${module.name}/src/scss/index';`
        }
        
        if(fs.existsSync(path.resolve(__dirname, `../subModules/${module.name}/src/store`))) { // 如果该目录下有store文件， 才会执行
          stores += `
  ${storesArg} = {...${storesArg}, ...{ ${module.name}: ${module.name + 'store'}}}`
          storeImports += `
  import ${module.name + 'store'} from './${module.name}/src/store/index'`
        }
        completeCount++
        checkSubmodules()
        
      })
    }
  } catch (e) {
    throw e
  }
}

function checkSubmodules() {
  if(completeCount === moduleCount) {
    console.log(chalk.green('\n All sub module downloaded! \n'))
    generateModuleFile()
  }
}
// 构建
function generateModuleFile() {
  console.log(chalk.blue('generating index.js \n'))
  let file = generateFunction(jsImports + storeImports, routers + stores, routersArg, storesArg)
  generateIndexJs(file)
  
  console.log(chalk.blue('generating indexStyle.scss!\n'))
  let styleFileContent = generateScssFunction(cssImports)
  generateIndexStyle(styleFileContent)
  
}

// clear local

function cleanOldModules(modules: string[], cb: Function) {
  try {
    if(modules.length > 0) {
      let module = modules.pop() || ''
      if(module !== 'index.json') {
        rm(path.resolve(__dirname, SUBMODULE_DIR, module), (err: Error) => {
          if(err) throw err
          cleanOldModules(modules, cb)
        })
      } else {
        cleanOldModules(modules, cb)
      }
    } else {
      cb && cb()
    }
  } catch (e) {
    throw e
  }
}

console.log(chalk.blue('clean folder...\n'))

fs.readdir(path.resolve(__dirname, SUBMODULE_DIR), (err, files) => {
  if(err) throw err
  if(files && files.length) { // sub modules 下有文件 才会执行下去 需要优化
    
    cleanOldModules(files, () => {
      console.log(chalk.blue('clean finished! \n'))
      
      moduleCount = submodules && submodules.length
      
      if(moduleCount > 0) {
        console.log(chalk.blue(`\n ************* there are ${moduleCount} modules ************* \n`))
        console.log(chalk.blue(`\n ************* start downloading sub modules ************* \n`))
        
        cloneSubModule(submodules)
      } else {
        console.log(chalk.red('No sub modules'))
      }
    })
  }
})
