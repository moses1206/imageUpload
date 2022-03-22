import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from 'react'
import axios from 'axios'
import { AuthContext } from './AuthContext'

export const ImageContext = createContext()

export const ImageProvider = (prop) => {
  const [images, setImages] = useState([])
  const [myImages, setMyImages] = useState([])
  const [isPublic, setIsPublic] = useState(false)
  const [imageUrl, setImageUrl] = useState('/images')
  const [imageLoading, setImageLoading] = useState(false)
  const [imageError, setimageError] = useState(false)
  const [me] = useContext(AuthContext)
  const pastImageUrlRef = useRef()

  useEffect(() => {
    if (pastImageUrlRef.current === imageUrl) return
    setImageLoading(true)
    axios
      .get(imageUrl)
      .then((result) =>
        // result값이 isPublic 유무에 따라 어디에 저장할지를 정해준다.
        isPublic
          ? setImages((prevData) => [...prevData, ...result.data])
          : setMyImages((prevData) => [...prevData, ...result.data])
      )
      .catch((err) => console.error(err))
      .catch((err) => {
        console.error(err)
        setimageError(true)
      })
      .finally(() => {
        setImageLoading(false)
        pastImageUrlRef.current = imageUrl
      })
  }, [imageUrl, isPublic])

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

  return (
    <ImageContext.Provider
      value={{
        images: isPublic ? images : myImages,
        setImages,
        setMyImages,
        setImageUrl,
        isPublic,
        setIsPublic,
        imageLoading,
        imageError,
      }}
    >
      {prop.children}
    </ImageContext.Provider>
  )
}
