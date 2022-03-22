import React, { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from './AuthContext'

export const ImageContext = createContext()

export const ImageProvider = (prop) => {
  const [images, setImages] = useState([])
  const [myImages, setMyImages] = useState([])
  const [isPublic, setIsPublic] = useState(false)
  const [imageUrl, setImageUrl] = useState('/images')
  const [me] = useContext(AuthContext)

  useEffect(() => {
    axios
      .get(imageUrl)
      .then((result) => setImages((prevData) => [...prevData, ...result.data]))
      .catch((err) => console.error(err))
  }, [imageUrl])

  useEffect(() => {
    if (me) {
      // headers에 sessionid가 장착되기 전에  이미지 불러오기 막기
      // 자바스크립트 이벤트 루프
      setTimeout(() => {
        axios
          .get('/users/me/images')
          .then((result) => setMyImages(result.data))
          .catch((err) => console.error(err))
      }, 0)
    } else {
      setMyImages([])
      setIsPublic(true)
    }
  }, [me])

  const loadMoreImages = () => {
    if (images.length === 0) return
    const lastImageId = images[images.length - 1]._id
    setImageUrl(`/images?lastid=${lastImageId}`)
  }

  return (
    <ImageContext.Provider
      value={{
        images,
        setImages,
        myImages,
        setMyImages,
        isPublic,
        setIsPublic,
        loadMoreImages,
      }}
    >
      {prop.children}
    </ImageContext.Provider>
  )
}
