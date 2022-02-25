import { Router } from 'express'
const imageRouter = Router()

import { Image } from '../models/Image.js'
import { upload } from '../middleware/ImageUpload.js'

imageRouter.post('/', upload.single('image'), async (req, res) => {
  const image = await new Image({
    key: req.file.filename,
    originalFileName: req.file.originalname,
  }).save()
  res.send(image)
})

imageRouter.get('/', async (req, res) => {
  const images = await Image.find()
  res.json(images)
})

export default imageRouter
