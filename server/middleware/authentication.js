import mongoose from 'mongoose'
import { User } from '../models/User.js'

const authenticate = async (req, res, next) => {
  const { sessionid } = req.headers
  if (!sessionid || !mongoose.isValidObjectId(sessionid)) return next()

  const user = await User.findOne({ 'sessions._id': sessionid })
  if (!user) return next()

  req.user = user
  return next()
}

export { authenticate }
