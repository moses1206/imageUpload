import React, { useContext, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { ImageContext } from '../context/ImageContext'
import './ImageList.css'

export default function ImageList() {
  const {
    images,
    isPublic,
    setIsPublic,
    imageLoading,
    imageError,
    setImageUrl,
  } = useContext(ImageContext)

  const [me] = useContext(AuthContext)
  const elementRef = useRef(null)

  // useCallback은 계속 리랜더링 되는 컴포넌트를 특정조건에만
  // 리랜더링 되도록 조건을 주어 지속적인 리랜더링을 막아서
  //  퍼포먼스를 개선한다.
  const loadMoreImages = useCallback(() => {
    if (images.length === 0 || imageLoading) return
    const lastImageId = images[images.length - 1]._id
    setImageUrl(`${isPublic ? '' : '/users/me'}/images?lastid=${lastImageId}`)
  }, [images, imageLoading, isPublic, setImageUrl])

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

  const imgList = images.map((image, index) => (
    <Link
      to={`/images/${image._id}`}
      key={image.key}
      ref={index + 4 === images.length ? elementRef : null}
    >
      <img
        alt=''
        src={`https://samyang-bucket.s3.ap-northeast-2.amazonaws.com/raw/${image.key}`}
      />
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
