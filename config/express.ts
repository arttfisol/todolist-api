import _ from 'lodash'
import cors from 'cors'
import logs from './logs'
import helmet from 'helmet'
import morgan from 'morgan'
import compress from 'compression'
import bodyParser from 'body-parser'
import methodOverride from 'method-override'
import { ValidationError } from 'express-validation'
import express, { Request, Response, NextFunction } from 'express'

import config from './config'
import apiRoute from '../server/routes'
import healthCheckRoute from '../server/routes/health-check'

const app = express()

// parse body params and attache them to req.body
app.use(bodyParser.json({
  limit: '40mb'
}))

app.use(bodyParser.urlencoded({
  extended: true
}))

// access log
app.use(morgan(':remote-addr :method :url :status :res[content-length] - :response-time ms', { stream: logs.stream }))

app.use(compress())
app.use(methodOverride())

// secure apps by setting various HTTP headers
app.use(helmet())

// enable CORS - Cross Origin Resource Sharing
app.use(cors())

declare module 'express-serve-static-core' {
  interface Request {
    request_id: string
    logInfo: (msg: string) => void
    logError: (msg: string) => void
  }
}

app.use((req: Request, res: Response, next: NextFunction) => {
  req.request_id = `${new Date().getTime()}_${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`
  req.logInfo = (msg) => logs.info(`${req.request_id} - ${msg}`)
  req.logError = (msg) => logs.error(`${req.request_id} - ${msg}`)
  req.logInfo(`${req.method} ${req.baseUrl + req.path} requestInfo=${JSON.stringify({ body: req.body, query: req.query, params: req.params })}`)

  next()
})

app.use('/', healthCheckRoute)
app.use('/api', apiRoute)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ValidationError) {
    if (['development', 'test'].includes(config.env)) {
      const message = {}
      _.set(message, 'query', _.get(err, 'details.query', []).map(q => q.message).join(', '))
      _.set(message, 'params', _.get(err, 'details.params', []).map(p => p.message).join(', '))
      _.set(message, 'body', _.get(err, 'details.body', []).map(b => b.message).join(', '))
      return res.status(400).json({
        message
      })
    } else {
      return res.status(400).json({
        message: 'Validation Failed'
      })
    }
  } else {
    return res.status(500).json({
      message: err.message,
      stack: ['development', 'test'].includes(config.env) ? err.stack : {}
    })
  }
})

// error handler, send stacktrace only during development
app.use((err: Error, req: Request, res: Response, next: NextFunction) => // eslint-disable-line no-unused-vars
  res.status(500).json({
    message: err.message,
    stack: ['development', 'test'].includes(config.env) ? err.stack : {}
  }))

export default app
