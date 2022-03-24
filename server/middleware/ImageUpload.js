import multer from 'multer'
import { v4 as uuid } from 'uuid'
import mime from 'mime-types'
import multerS3 from 'multer-s3'
import { s3 } from '../aws.js'

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, './uploads'),
//   filename: (req, file, cb) =>
//     cb(null, `${uuid()}.${mime.extension(file.mimetype)}`),
// })

const storage = multerS3({
  s3,
  bucket: 'samyang-bucket',
  key: (req, file, cb) => {
    cb(null, `raw/${uuid()}.${mime.extension(file.mimetype)}`)
  },
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

export { upload }
