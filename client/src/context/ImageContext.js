import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
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

  useEffect(() => {
    setImageLoading(true)
    axios
      .get(imageUrl)
      .then((result) => setImages((prevData) => [...prevData, ...result.data]))
      .catch((err) => console.error(err))
      .catch((err) => {
        console.error(err)
        setimageError(true)
      })
      .finally(() => setImageLoading(false))
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

  // 처음에는 라스트 아이디가 없으므로 null값 처리를 해준다.
  const lastImageId = images.length > 0 ? images[images.length - 1]._id : null

  // useCallback은 계속 리랜더링 되는 컴포넌트를 특정조건에만
  // 리랜더링 되도록 조건을 주어 지속적인 리랜더링을 막아서
  //  퍼포먼스를 개선한다.
  const loadMoreImages = useCallback(() => {
    if (imageLoading || !lastImageId) return
    setImageUrl(`/images?lastid=${lastImageId}`)
  }, [lastImageId, imageLoading])

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
        imageLoading,
        imageError,
      }}
    >
      {prop.children}
    </ImageContext.Provider>
  )
}
