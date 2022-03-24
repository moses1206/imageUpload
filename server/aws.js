import aws from 'aws-sdk'
import dotenv from 'dotenv'

dotenv.config()

const { AWS_ACCESS_KEY, AWS_SECRET_KEY } = process.env

const s3 = new aws.S3({
  secretAccessKey: AWS_SECRET_KEY,
  accessKeyId: AWS_ACCESS_KEY,
  region: 'ap-northeast-2',
})

const getSignedUrl = ({ key }) => {
  return new Promise((resolve, reject) => {
    s3.createPresignedPost(
      {
        Bucket: 'samyang-bucket',
        Fields: {
          key: key,
        },
        // preSignedUrl의 유효기간을 설정
        Expires: 300, //300초
        // 50MB 제한
        Conditions: [
          ['content-length-range', 0, 50 * 1024 * 1024],
          // 모든 이미지는 다 허용
          ['starts-with', '$Content-Type', 'image/'],
        ],
      },
      (err, data) => {
        if (err) reject(err)
        resolve(data)
      }
    )
  })
}

export { s3, getSignedUrl }
