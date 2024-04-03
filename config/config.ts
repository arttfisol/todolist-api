import Joi from 'joi'

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('production', 'development', 'test')
    .default('development'),
  PORT: Joi.number().default(4040)

})
  .unknown()
  .required()

const { error, value: envVars } = envVarsSchema.validate(process.env)

if (error != null) {
  throw new Error(`Config validation error: ${error.message}`)
}

export default {
  env: String(envVars.NODE_ENV),
  port: parseInt(envVars.PORT, 10)
}
