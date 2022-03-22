import React, { useState, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

import ProgressBar from './ProgressBar'
import { ImageContext } from '../context/ImageContext'

import './UploadForm.css'

export default function UploadForm() {
  const { setImages, setMyImages } = useContext(ImageContext)
  const [files, setFiles] = useState(null)
  const [previews, setPreviews] = useState([])
  const [percent, setPercent] = useState(0)
  const [isPublic, setIsPublic] = useState(true)

  const imageSelectHandler = async (e) => {
    const imageFiles = e.target.files
    setFiles(imageFiles)

    // 배열 이미지 url을 imagePreviews에 저장하기
    const imagePreviews = await Promise.all(
      // imageFiles는 배열이 아니라서 ...imageFile로 배열로 변환
      [...imageFiles].map(async (imageFile) => {
        return new Promise((resolve, reject) => {
          // 성공한 결과를 resolve에 실패한 결과를 reject에 입력
          // resolve에는 이미지의 url 값이 들어감
          try {
            const fileReader = new FileReader()
            fileReader.readAsDataURL(imageFile)
            fileReader.onload = (e) =>
              // onload를 통해 url로 이미지를 전달하도록 변환됨
              resolve({ imgSrc: e.target.result, fileName: imageFile.name })
          } catch (err) {
            reject(err)
          }
        })
      })
    )

    setPreviews(imagePreviews)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()

    for (let file of files) formData.append('image', file)

    formData.append('public', isPublic)
    try {
      const res = await axios.post('/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          setPercent(Math.round((100 * e.loaded) / e.total))
        },
      })

      if (isPublic) setImages((prevData) => [...res.data, ...prevData])
      setMyImages((prevData) => [...res.data, ...prevData])

      toast.success('이미지 업로드 성공!!')
      setTimeout(() => {
        setPercent(0)
        setPreviews([])
      }, 1000)
    } catch (err) {
      toast.error(err.response.data.message)
      setPercent(0)
      setPreviews([])
      console.log(err)
    }
  }

  const previewImages = previews.map((preview, index) => (
    <img
      key={index}
      style={{ width: 200, height: 200, objectFit: 'cover' }}
      src={preview.imgSrc}
      alt=''
      className={`image-preview ${preview.imgSrc && 'image-preview-show'} `}
    />
  ))

  const fileName =
    previews.length === 0
      ? '이미지를 업로드 해주세요!!'
      : previews.reduce(
          (previews, current) => previews + `${current.fileName},`,
          ''
        )

  return (
    <form onSubmit={onSubmit}>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>{previewImages}</div>
      <ProgressBar percent={percent} />
      <div className='file-dropper'>
        {fileName}
        <input
          id='image'
          type='file'
          multiple={true}
          accept='image/*'
          onChange={imageSelectHandler}
        />
      </div>
      <input
        type='checkbox'
        id='public-check'
        value={!isPublic}
        onChange={() => setIsPublic(!isPublic)}
      />
      <label htmlFor='public-check'>비공개</label>
      <button
        style={{
          width: '100%',
          borderRadius: 5,
          height: 40,
          cursor: 'pointer',
        }}
        type='submit'
      >
        제출
      </button>
    </form>
  )
}
