import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import imageRouter from './routes/imageRouter.js'
import userRouter from './routes/userRouter.js'

dotenv.config()

const app = express()

const { MONGO_URI, PORT } = process.env

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected !!')

    // Can read req Json
    app.use(express.json())

    // Router
    app.use('/uploads', express.static('uploads'))
    app.use('/images', imageRouter)
    app.use('/users', userRouter)

    app.listen(PORT, () =>
      console.log('Express server listening on PORT ' + PORT)
    )
  })
  .catch((err) => console.log(err))
