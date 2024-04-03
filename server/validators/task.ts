import Joi from 'joi'
import { ParsedQs } from 'qs'
import { ParamsDictionary } from 'express-serve-static-core'

export interface Params extends ParamsDictionary {
  task_id: string
}

export interface ListQuery extends ParsedQs {
  skip: string
  limit: string
}

export interface CreateBody {
  title: string
  desc: string
}

export interface UpdateBody {
  title: string
  desc: string
  is_done: boolean
}

const validate = {
  list: {
    query: Joi.object({
      skip: Joi.number().default(0),
      limit: Joi.number().default(10)
    })
  },
  create: {
    body: Joi.object({
      title: Joi.string().required(),
      desc: Joi.string().required()
    })
  },
  get: {
    params: Joi.object({
      task_id: Joi.string().required()
    })
  },
  update: {
    params: Joi.object({
      task_id: Joi.string().required()
    }),
    body: Joi.object({
      title: Joi.string(),
      desc: Joi.string(),
      is_done: Joi.boolean()
    })
  },
  remove: {
    params: Joi.object({
      task_id: Joi.string().required()
    })
  }
}

export default validate
