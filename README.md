# multi-module
multi module

## package.json
``js scripts

"": {
    "prestart": "node build/break.js", // start 命令执行前的钩子
    "start": "echo \"Here is start\"",
    "loadSubModules": "ts-node build/multi-module-build.ts",
  },
`` 

