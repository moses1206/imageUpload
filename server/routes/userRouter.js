import { Router } from 'express'
const userRouter = Router()

import { User } from '../models/User.js'
import bcrypt from 'bcryptjs'

userRouter.post('/register', async (req, res) => {
  try {
    if (req.body.password.length < 6)
      throw new Error('비밀번호를 최소 6자 이상으로 해주세요 !!')

    if (req.body.username.length < 3)
      throw new Error('username 최소 3자 이상으로 해주세요 !!')

    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    console.log({ hashedPassword })
    await new User({
      name: req.body.name,
      username: req.body.username,
      hashedPassword: hashedPassword,
    }).save()

    res.json({ message: 'user register !!' })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

export default userRouter
