import taskRoute from './task'
import { Router } from 'express'

const router = Router()

router.use('/tasks', taskRoute)

export default router
