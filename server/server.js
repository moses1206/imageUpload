import express from 'express'
import multer from 'multer'
import { v4 as uuid } from 'uuid'
import mime from 'mime-types'

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
    if (['image/jpeg', 'image/jpeg'].includes(file.mimetype)) {
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

app.use('/uploads', express.static('uploads'))

app.post('/upload', upload.single('imageTest'), (req, res) => {
  console.log(req.file)
  res.send(req.file)
})

app.listen(PORT, () => console.log('Express server listening on PORT ' + PORT))
