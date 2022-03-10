import mongoose from 'mongoose'

const ImageSchema = new mongoose.Schema(
  {
    user: {
      // 유저가 작성한 이미지만 불러오기가 많이 사용되기에 index:true를 통해 검색 향상
      // 인덱스 처리는 얼마나 많은 분기가 있느냐에 달려있다. 많은 유저정보가 생성되기에
      // 많은 분기처리가 되는 필드는 인덱스가 유용하다.
      _id: { type: mongoose.Types.ObjectId, required: true, index: true },
      name: { type: String, required: true },
      username: { type: String, required: true },
    },
    likes: [{ type: mongoose.Types.ObjectId }],
    public: { type: Boolean, required: true, default: false },
    key: { type: String, required: true },
    originalFileName: { type: String, required: true },
  },
  { timestamps: true }
)

const Image = mongoose.model('image', ImageSchema)

export { Image, ImageSchema }
