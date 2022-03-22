import { Router } from 'express'
const userRouter = Router()

import { User } from '../models/User.js'
import bcrypt from 'bcryptjs'
import { Image } from '../models/Image.js'
import mongoose from 'mongoose'

userRouter.post('/register', async (req, res) => {
  try {
    if (req.body.password.length < 6)
      throw new Error('비밀번호를 최소 6자 이상으로 해주세요 !!')

    if (req.body.username.length < 3)
      throw new Error('username 최소 3자 이상으로 해주세요 !!')

    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const user = await new User({
      name: req.body.name,
      username: req.body.username,
      hashedPassword: hashedPassword,
      sessions: [{ createdAt: new Date() }],
    }).save()

    const session = user.sessions[0]

    res.json({
      message: 'user register !!',
      sessionId: session._id,
      name: user.name,
      userId: user._id,
    })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

userRouter.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })

    if (!user) throw new Error('가입되지 않은 아이디 입니다. !!')

    const isValid = await bcrypt.compare(req.body.password, user.hashedPassword)

    if (!isValid) throw new Error('입력하신 정보가 올바르지 않습니다. !!')

    // Session 로그인
    user.sessions.push({ createdAt: new Date() })
    await user.save()
    const session = user.sessions[user.sessions.length - 1]

    res.json({
      message: 'user validated !!',
      sessionId: session._id,
      name: user.name,
      userId: user._id,
    })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

userRouter.post('/logout', async (req, res) => {
  try {
    if (!req.user) throw new Error('invalid sessionid !!')

    await User.updateOne(
      { _id: req.user.id },
      { $pull: { sessions: { _id: req.headers.sessionid } } }
    )

    console.log(req.user)

    res.json({ message: 'user is logged out' })
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err.message })
  }
})

userRouter.get('/me', (req, res) => {
  try {
    if (!req.user) throw new Error('권한이 없습니다. !!')

    res.json({
      message: 'success !!',
      sessionId: req.headers.sessionid,
      name: req.user.name,
      userId: req.user._id,
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: err.message })
  }
})

userRouter.get('/me/images', async (req, res) => {
  // 본인의 사진들만 리턴(public === false)

  try {
    const { lastid } = req.query
    if (lastid && !mongoose.isValidObjectId(lastid))
      throw new Error('invalid lastid')

    if (!req.user) throw new Error('권한이 없습니다. !!')
    const images = await Image.find(
      lastid
        ? { 'user._id': req.user.id, _id: { $lt: lastid } }
        : { 'user._id': req.user.id }
    )
      .sort({
        _id: -1,
      })
      .limit(8)
    res.json(images)
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: err.message })
  }
})

export default userRouter
