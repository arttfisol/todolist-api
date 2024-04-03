import { createLogger, format, transports, Logger } from 'winston'

class Logs {
  _allTransports: transports.ConsoleTransportInstance[]
  _logs: Logger
  stream: { write: (message: string, encoding?: string) => void }

  constructor () {
    this._allTransports = [
      new transports.Console({
        format: format.combine(
          format.colorize(),
          format.printf(info => `${info.timestamp as string} ${info.level.padEnd(info.level.length <= 7 ? 7 : 17, ' ')}: ${info.message as string}`)
        )
      })
    ]

    this._logs = createLogger({
      level: 'silly',
      format: format.combine(
        format.timestamp()
      ),
      transports: this._allTransports
    })

    this.stream = {
      write: (message, encoding) => {
        this._logs.info(message.trim())
      }
    }
  }

  error (...messages: string[]): void {
    const msg = this._parse(messages)
    this._logs.error(msg)
  }

  warn (...messages: string[]): void {
    const msg = this._parse(messages)
    this._logs.warn(msg)
  }

  info (...messages: string[]): void {
    const msg = this._parse(messages)
    this._logs.info(msg)
  }

  http (...messages: string[]): void {
    const msg = this._parse(messages)
    this._logs.http(msg)
  }

  verbose (...messages: string[]): void {
    const msg = this._parse(messages)
    this._logs.verbose(msg)
  }

  debug (...messages: string[]): void {
    const msg = this._parse(messages)
    this._logs.debug(msg)
  }

  silly (...messages: string[]): void {
    const msg = this._parse(messages)
    this._logs.silly(msg)
  }

  _parse (messages: string[]): string {
    const arr = messages.map(msg => {
      if (typeof (msg) === 'object') {
        return JSON.stringify(msg)
      }
      return msg
    })

    return arr.join('')
  }
}

export default new Logs()
