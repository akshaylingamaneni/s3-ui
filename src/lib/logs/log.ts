import pino, { Logger, Level, LevelWithSilent } from 'pino'

class LoggerService {
  private static instance?: LoggerService
  private log: Logger

  private constructor() {
    this.log = pino({
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
      transport: process.env.NODE_ENV === "production" 
        ? undefined 
        : {
            target: "pino-pretty",
            options: {
              colorize: true,
              translateTime: 'UTC:yyyy-mm-dd HH:MM:ss.l',
              ignore: 'pid,hostname',
            },
          },
      timestamp: process.env.NODE_ENV === "production" 
        ? pino.stdTimeFunctions.isoTime 
        : undefined
    })
  }

  static get(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService()
    }
    return LoggerService.instance
  }

  setLevel = (level: LevelWithSilent): void => {
    this.log.level = level
  }

  getLevel = (): string => this.log.level

  fatal = (obj: object | string, msg?: string, ...args: any[]): void => 
    this.log.fatal(obj, msg, ...args)

  error = (obj: object | string, msg?: string, ...args: any[]): void => 
    this.log.error(obj, msg, ...args)

  warn = (obj: object | string, msg?: string, ...args: any[]): void => 
    this.log.warn(obj, msg, ...args)

  info = (obj: object | string, msg?: string, ...args: any[]): void => 
    this.log.info(obj, msg, ...args)

  debug = (obj: object | string, msg?: string, ...args: any[]): void => 
    this.log.debug(obj, msg, ...args)

  trace = (obj: object | string, msg?: string, ...args: any[]): void => 
    this.log.trace(obj, msg, ...args)

  child = (bindings: Record<string, any>): Logger => 
    this.log.child(bindings)
}

// Export singleton instance
export const log = LoggerService.get()
