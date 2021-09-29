// winston https://www.npmjs.com/package/winston
const { createLogger, format, transports } = require('winston')
require('winston-daily-rotate-file')
const fs = require("fs");
const path = require("path");
const LOG_LEVEL = {
  info: 'info',
  warn: 'warn',
  error: 'error'
}

let _logger = null

function createInstance(options) {
  const _create = (options) => {
    let logger = null
    const { logPath, project, env } = options
    const { combine, timestamp } = format
    const addCustomKey = format((info, opt) => {
      if (opt.project && opt.env && opt.team) {
        info.customindex = `swc-${opt.team}-${opt.project}-${opt.env}-${info.level}-log`.toLowerCase()
        info.env = opt.env
      }
      return info
    })

    logger = createLogger({
      level: LOG_LEVEL.info,
      format: combine(
        timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSS+08:00', alias: 'log time' }),
        addCustomKey({ logPath, project, env }),
        format.json(),
      )
    })

    if (!fs.existsSync(logPath)) {
      fs.mkdirSync(logPath)
    }

    logger.clear().add(
      new transports.DailyRotateFile({
        name: 'file',
        datePattern: 'YYYY-MM-DD-HH',
        filename: path.join(logPath, '%DATE%.log'),
        zippedArchive: false,
      }),
    )
    if (process.env.NODE_ENV !== 'production') {
      logger.add(
        new transports.Console({
          format: combine(
            format.colorize(),
            timestamp(),
            format.align(),
            format.printf(
              info => `${info.timestamp} [${info.level}]: ${info.message}`,
            ),
          ),
        }),
      )
    }
    return logger
  }
  if (!_logger) {
    _logger = _create(options)
  }
  return _logger
}

class Logger {
  constructor(options) {
    this.instance = createInstance(options)
  }

  log(level, context) {
    this.instance.log({
      level,
      ...context
    })
  }

  info(message) {
    return this.log(LOG_LEVEL.info, { message })
  }

  warn(message) {
    return this.log(LOG_LEVEL.warn, { message })
  }

  error(message) {
    return this.log(LOG_LEVEL.error, { message })
  }
}

module.exports = Logger
