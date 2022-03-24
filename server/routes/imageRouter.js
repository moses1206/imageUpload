import { Router } from 'express'
const imageRouter = Router()

import { Image } from '../models/Image.js'
import { upload } from '../middleware/ImageUpload.js'
import fs from 'fs'
import { promisify } from 'util'
import mongoose from 'mongoose'
import { s3 } from '../aws.js'

// unlink를 프로미스를 리턴하도록 해준다.
const fileUnlink = promisify(fs.unlink)

imageRouter.post('/', upload.array('image', 5), async (req, res) => {
  // 유저정보 , public 유무
  try {
    if (!req.user) throw new Error('권한이 없습니다. !!')

    const images = await Promise.all(
      req.files.map(async (file) => {
        const image = await new Image({
          user: {
            _id: req.user.id,
            name: req.user.name,
            username: req.user.username,
          },
          public: req.body.public,
          // aws에서 리턴되는 "aws/abc.jpg"에서 "aws/" 를 제거
          key: file.key.replace('raw/', ''),
          originalFileName: file.originalname,
        }).save()
        return image
      })
    )
    res.json(images)
  } catch (err) {
    console.error(err)
    return res.status(400).json({ message: err.message })
  }
})

imageRouter.get('/', async (req, res) => {
  try {
    const { lastid } = req.query
    if (lastid && !mongoose.isValidObjectId(lastid))
      throw new Error('invalid lastid')
    // offset vs curser
    // offset : ex> skip(2).limit(2)  데이터를 중간에 삽입 삭제했을때 순서가 꼬이는 단점.
    // curser : 마지막 아이디를 찾고 그것보다 큰것(gt)을 가져와라.

    const images = await Image.find(
      lastid
        ? {
            public: true,
            _id: { $lt: lastid },
          }
        : { public: true }
    )

      // 최신순으로 이미지 올리기
      .sort({ _id: -1 })
      .limit(8)
    return res.json(images)
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: err.message })
  }
})

imageRouter.get('/:imageId', async (req, res) => {
  try {
    const { imageId } = req.params
    if (!mongoose.isValidObjectId(imageId))
      throw new Error('올바르지 않는 이미지id입니다.')
    const image = await Image.findOne({ _id: imageId })
    if (!image) throw new Error('해당 이미지는 존재 하지 않습니다.')
    if (!image.public && (!req.user || req.user.id !== image.user.id))
      throw new Error('권한이 없습니다.')
    res.json(image)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err.message })
  }
})

imageRouter.delete('/:imageId', async (req, res) => {
  // 유저 권한 확인
  try {
    if (!req.user) throw new Error('권한이 없습니다.!!')
    if (!mongoose.isValidObjectId(req.params.imageId))
      throw new Error('올바르지 않은 오브젝트 아이디입니다.')

    // 데이터베이스 이미지 삭제
    const image = await Image.findOneAndDelete({ _id: req.params.imageId })
    if (!image) return res.json({ message: '이미지를 찾을 수 없습니다. !!' })
    // uploads 폴더 이미지 삭제
    // await fileUnlink(`./uploads/${image.key}`)
    s3.deleteObject(
      { Bucket: 'samyang-bucket', Key: `raw/${image.key}` },
      (error, data) => {
        if (error) throw error
      }
    )

    return res.json({ image: image, message: '이미지가 삭제되었습니다. !' })

    // 데이터베이스에서 데이터삭제.
  } catch (err) {
    console.error(err)
    return res.status(400).json({ message: err.message })
  }
  // 사진 삭제 1. uploads 폴더의 사진 삭제 , 2. 데이터베이스 이미지 문서 삭제
})

imageRouter.patch('/:imageId/like', async (req, res) => {
  // 유저 권한 확인
  try {
    if (!req.user) throw new Error('권한이 없습니다.!!')

    if (!mongoose.isValidObjectId(req.params.imageId)) {
      throw new Error('올바르지 않은 ImageId입니다.!')
    }

    // findOneAndUpdate({Search},{Update content},{Options})
    const image = await Image.findOneAndUpdate(
      { _id: req.params.imageId },
      {
        // 단순히 likes에 아이디 입력
        // $push: { likes: user.id },
        // 중복된 아이디 확인후 없으면 입력, 유니크 아이디 입력
        // 이미 좋아요를 눌렀는지 확인할 필요가 없다.
        $addToSet: { likes: req.user.id },
      },
      { new: true }
    )
    return res.json(image)
  } catch (err) {
    console.error(err)
    return res.status(400).json({ message: err.message })
  }
  // like 중복 안되도록 확인(1사람이 1번)
})

imageRouter.patch('/:imageId/unlike', async (req, res) => {
  // 유저 권한 확인
  try {
    if (!req.user) throw new Error('권한이 없습니다.!!')

    if (!mongoose.isValidObjectId(req.params.imageId))
      throw new Error('올바르지 않은 ImageId입니다.!')

    const image = await Image.findOneAndUpdate(
      { _id: req.params.imageId },
      { $pull: { likes: req.user.id } },
      { new: true }
    )
    return res.json(image)
  } catch (err) {
    console.error(err)
    return res.status(400).json({ message: err.message })
  }
  // like 중복 취소 안되도록 확인(1사람이 1번)
})

export default imageRouter
