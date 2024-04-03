import { RequestHandler } from 'express'
import { validate, schema } from 'express-validation'

export default (schema: schema): RequestHandler => validate(schema, { context: true }, { allowUnknown: true, abortEarly: false })
