import { Router } from 'express'
import validator from '../validators'
import taskValidator from '../validators/task'
import taskController from '../controllers/task'

const router = Router()

router.route('/')
  .get(validator(taskValidator.list), taskController.list)
  .post(validator(taskValidator.create), taskController.create)

router.route('/:task_id')
  .get(validator(taskValidator.get), taskController.get)
  .patch(validator(taskValidator.update), taskController.update)
  .delete(validator(taskValidator.remove), taskController.remove)

router.param('task_id', taskController.load)

export default router
