import dotenv from 'dotenv'
import app from './config/express'
import http, { Server } from 'http'
import config from './config/config'
import { GracefulShutdownManager } from '@moebius/http-graceful-shutdown'

dotenv.config()

let server: Server
let isShutingDown: boolean
let shutdownManager: GracefulShutdownManager

function main (): undefined {
  console.log('start instance...')

  try {
    server = http.createServer(app)
    shutdownManager = new GracefulShutdownManager(server)

    // listen on port config.port
    server.listen(config.port, () => console.log(`server started on port ${config.port} (${config.env})`))
  } catch (err) {
    console.error(err)
    process.exit(0)
  }
}

function prepareToShutdown (): void {
  if (isShutingDown) {
    console.log('Received Duplicate Termination Signal, Ignore.')
    return
  }

  console.log('Received Termination Signal, Preparing graceful shutdown process..')
  isShutingDown = true

  shutdownManager.terminate((): void => {
    void (async () => {
      await Promise.all([
        new Promise((resolve) => {
          server.close(() => {
            console.log('Server closed')
            resolve('Server')
          })
        })
      ])
      console.log('No task left, Graceful shutdown finished!')
      process.exit(0)
    })()
  })
}

main()

process.on('SIGINT', prepareToShutdown)
process.on('SIGTERM', prepareToShutdown)

module.exports = app
