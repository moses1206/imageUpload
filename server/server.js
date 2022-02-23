import express from 'express'
import multer from 'multer'
import { v4 as uuid } from 'uuid'
import mime from 'mime-types'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { Image } from './models/Image.js'

dotenv.config()

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads'),
  filename: (req, file, cb) =>
    cb(null, `${uuid()}.${mime.extension(file.mimetype)}`),
})

const upload = multer({
  storage,
  // 이미지 파일만 업로드 되도록 설정 , 이미지 사이즈 제한
  fileFilter: (req, file, cb) => {
    // jpeg & png만 업로드 되도록 설정
    if (['image/jpeg', 'image/png'].includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type'), false)
    }
  },
  limits: {
    // 5메가바이트 이하로 설정.
    fileSize: 1024 * 1024 * 5,
  },
})

const app = express()
const PORT = 5000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected !!'),
      app.use('/uploads', express.static('uploads'))

    app.post('/images', upload.single('image'), async (req, res) => {
      const image = await new Image({
        key: req.file.filename,
        originalFileName: req.file.originalname,
      }).save()
      res.send(image)
    })

    app.get('/images', async (req, res) => {
      const images = await Image.find()
      res.json(images)
    })

    app.listen(PORT, () =>
      console.log('Express server listening on PORT ' + PORT)
    )
  })
  .catch((err) => console.log(err))
