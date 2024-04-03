import _ from 'lodash'
import Cache, { Task } from '../../config/cache'
import { Request, Response, NextFunction } from 'express'
import { Params, ListQuery, CreateBody, UpdateBody } from '../validators/task'

declare module 'express-serve-static-core' {
  interface Request {
    task?: Task | undefined
  }
}

function load (req: Request, res: Response, next: NextFunction): void {
  try {
    const { task_id: taskId } = req.params as Params
    req.task = Cache.get(taskId)

    if (req.task === undefined) {
      res.sendStatus(404)
      return
    }

    next()
  } catch (e) {
    next(e)
  }
}

function list (req: Request, res: Response, next: NextFunction): void {
  try {
    const query = req.query as ListQuery
    const skip = parseInt(query.skip)
    const limit = parseInt(query.limit)
    const result = Cache.list(parseInt(query.skip), parseInt(query.limit))
    res.json({
      total: result.length,
      skip,
      limit,
      tasks: Cache.list(skip, limit)
    })
  } catch (e) {
    next(e)
  }
}

function get (req: Request, res: Response, next: NextFunction): void {
  try {
    res.json({
      task: req.task
    })
  } catch (e) {
    next(e)
  }
}

function create (req: Request, res: Response, next: NextFunction): void {
  try {
    const body = req.body as CreateBody

    const payload = {
      id: String(Cache.count),
      title: body.title,
      desc: body.desc,
      is_done: false,
      created_time: new Date()
    }

    if (Cache.get(payload.id) !== undefined) {
      res.status(403).json({ message: 'Duplicate ID' })
      return
    }
    Cache.create(payload)
    res.json({
      task: payload
    })
  } catch (e) {
    next(e)
  }
}

function update (req: Request, res: Response, next: NextFunction): void {
  try {
    const body = req.body as UpdateBody
    console.log(body)
    !(body.title === null || body.title === undefined) && _.set(req, 'task.title', body.title)
    !(body.desc === null || body.desc === undefined) && _.set(req, 'task.desc', body.desc)
    !(body.is_done === null || body.is_done === undefined) && _.set(req, 'task.is_done', body.is_done)

    console.log(req.task)
    Cache.update(req.task as Task)
    res.json({
      task: req.task
    })
  } catch (e) {
    next(e)
  }
}

function remove (req: Request, res: Response, next: NextFunction): void {
  try {
    Cache.remove(req.task?.id as string)
    res.json({
      task: req.task
    })
  } catch (e) {
    next(e)
  }
}

export default {
  get,
  load,
  list,
  create,
  update,
  remove
}
