import { Router, Request, Response } from 'express'

const router = Router()

router.get('/', (req: Request, res: Response): Response => {
  return res.send('Todolist API')
})

/** GET /health-check - Check service health */
router.get('/health-check', (req: Request, res: Response): Response => {
  return res.send('OK')
})

export default router
