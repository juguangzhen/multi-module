/**
 * @author: guangzhen.ju.o
 * @date: 16/06/2021 16:04
 * */

module.exports = function (imports, routers, routerArgs, storesArg) {
  return `
  ${imports}
  
  ${routers}
  
  export default function configRouter(router, store) {
    ${storesArg}.forEach((ele, index) => {
      store.registerModule(index, ele, { preserveState: !!store.state[index] })
    })
    return ${routerArgs}
  }
  `
}
