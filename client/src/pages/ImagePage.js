import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ImageContext } from '../context/ImageContext'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

export default function ImagePage() {
  const { imageId } = useParams()
  const { images, setImages, myImages, setMyImages } = useContext(ImageContext)
  const [me] = useContext(AuthContext)

  const [hasLiked, setHasLiked] = useState(false)

  const navigate = useNavigate()

  const image =
    images.find((image) => image._id === imageId) ||
    myImages.find((image) => image._id === imageId)

  useEffect(() => {
    if (me && image && image.likes.includes(me.userId)) {
      setHasLiked(true)
    }
  }, [me, image])

  if (!image) return <h3>Loading...</h3>

  const updataImage = (images, image) =>
    [...images.filter((image) => image._id !== imageId), image].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )

  const onSubmit = async () => {
    const result = await axios.patch(
      `/images/${imageId}/${hasLiked ? 'unlike' : 'like'}`
    )

    if (result.data.public) {
      setImages(updataImage(images, result.data))
    } else {
      setMyImages(updataImage(myImages, result.data))
    }

    setHasLiked(!hasLiked)
  }

  const onDeleteHander = async () => {
    try {
      if (!window.confirm('정말 이미지를 삭제하시겠습니까?')) return
      const result = await axios.delete(`/images/${imageId}`)
      setImages(images.filter((image) => image._id !== imageId))
      setMyImages(myImages.filter((image) => image._id !== imageId))
      navigate('/')
      toast.success(result.data.message)
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div>
      <h3>Image Page - {imageId}</h3>
      <img
        style={{ width: '100%' }}
        alt={imageId}
        src={`http://localhost:5000/uploads/${image.key}`}
      />
      <span>좋아요 {image.likes.length}</span>
      <button style={{ float: 'right' }} onClick={onSubmit}>
        {hasLiked ? '좋아요 취소' : '좋아요'}
      </button>

      {/* 유저가 로그인이 되어있고 이미지 작성 유저가 로그인 유저와 같을때 */}
      {me && image.user._id === me.userId ? (
        <button
          style={{ float: 'right', marginRight: '10px' }}
          onClick={onDeleteHander}
        >
          삭제하기
        </button>
      ) : null}
    </div>
  )
}
