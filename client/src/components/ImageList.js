import React, { useContext, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { ImageContext } from '../context/ImageContext'
import './ImageList.css'

export default function ImageList() {
  const {
    images,
    myImages,
    isPublic,
    setIsPublic,
    loadMoreImages,
    imageLoading,
    imageError,
  } = useContext(ImageContext)
  const [me] = useContext(AuthContext)

  const elementRef = useRef(null)

  useEffect(() => {
    if (!elementRef.current) return
    // 움직임을 체킹하기로 한 태그가 눈에 들어올때
    // entry.isInterseting이 true로 변함

    const observer = new IntersectionObserver(([entry]) => {
      console.log('intersection', entry.isIntersecting)
      if (entry.isIntersecting) loadMoreImages()
    })
    observer.observe(elementRef.current)
    // 옵저버로 체킹후 데이터를 불러오고 나서 다시 위로 올리다 보면
    // 더블로 체킹되어 same Key 오류가 나게 된다. 1번 감지한 후
    // 옵저버를 풀어주어야 한다.
    return () => observer.disconnect()
  }, [loadMoreImages])

  const imgList = isPublic
    ? images.map((image, index) => (
        <Link
          to={`/images/${image._id}`}
          key={image.key}
          ref={index + 1 === images.length ? elementRef : null}
        >
          <img alt='' src={`http://localhost:5000/uploads/${image.key}`} />
        </Link>
      ))
    : myImages.map((image, index) => (
        <Link
          to={`/images/${image._id}`}
          key={image.key}
          // 끝에서 3번째 이미지가 나올때 불러오도록 설정
          ref={index + 3 === myImages.length ? elementRef : null}
        >
          <img alt='' src={`http://localhost:5000/uploads/${image.key}`} />
        </Link>
      ))

  return (
    <div>
      <h3 style={{ display: 'inline-block', marginRight: 10 }}>
        Image List ({isPublic ? '공개' : '개인'} 사진)
      </h3>
      {me && (
        <button onClick={() => setIsPublic(!isPublic)}>
          {(isPublic ? '개인' : '공개') + ' 사진 보기'}
        </button>
      )}

      <div className='image-list-container'>{imgList}</div>
      {imageError && <div>Image Loading Error ...</div>}
      {imageLoading && <div>Image Loading ...</div>}
    </div>
  )
}
