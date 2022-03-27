import React, { useState, useContext, useRef } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

import ProgressBar from './ProgressBar'
import { ImageContext } from '../context/ImageContext'

import './UploadForm.css'

export default function UploadForm() {
  const { setImages, setMyImages } = useContext(ImageContext)
  const [files, setFiles] = useState(null)
  const [previews, setPreviews] = useState([])
  const [percent, setPercent] = useState([])
  const [isPublic, setIsPublic] = useState(true)
  const inputRef = useRef()
  const [isLoading, setIsLoading] = useState(false)

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

  const onSubmitV2 = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      // preSignedUrl을 통해 이미지 파일 S3 Upload
      const presignedData = await axios.post('/images/presigned', {
        // files가 배열이 아니라서 [...files]로 배열로 변환함.
        contentTypes: [...files].map((file) => file.type),
      })

      console.log(presignedData)

      const result = await Promise.all(
        [...files].map((file, index) => {
          const { presigned } = presignedData.data[index]
          const formData = new FormData()
          for (const key in presigned.fields) {
            formData.append(key, presigned.fields[key])
          }
          formData.append('Content-Type', file.type)
          formData.append('file', file)
          const result = axios.post(presigned.url, formData, {
            onUploadProgress: (e) => {
              setPercent((prevData) => {
                const newData = [...prevData]
                newData[index] = Math.round((100 * e.loaded) / e.total)
                return newData
              })
            },
          })
          return result
        })
      )
      console.log('preSignedUrl_Uplad', result)
      console.log('...file', [...files])
      console.log('PreSignedData', presignedData.data)

      // MongoDB에 저장
      const res = await axios.post('/images', {
        images: [...files].map((file, index) => ({
          imageKey: presignedData.data[index].imageKey,
          originalname: file.name,
        })),
        public2: isPublic,
      })

      if (isPublic) setImages((prevData) => [...res.data, ...prevData])
      setMyImages((prevData) => [...res.data, ...prevData])

      toast.success('이미지 업로드 성공!!')
      setTimeout(() => {
        setPercent([])
        setPreviews([])
        // 동일한 이미지를 다시 올릴때 입력값의 변화가 없어서
        // onChange가 발동되지 않음.
        // inputRef를 사용하여 input 태그를 초기화 해줌.
        inputRef.current.value = null
        setIsLoading(false)
      }, 2000)
    } catch (err) {
      console.log(err)
      toast.error(err.response.data.message)
      setPercent([])
      setPreviews([])
      setIsLoading(false)
    }
  }

  // const onSubmit = async (e) => {
  //   e.preventDefault()
  //   const formData = new FormData()

  //   for (let file of files) formData.append('image', file)

  //   formData.append('public', isPublic)
  //   try {
  //     const res = await axios.post('/images', formData, {
  //       headers: { 'Content-Type': 'multipart/form-data' },
  //       onUploadProgress: (e) => {
  //         setPercent(Math.round((100 * e.loaded) / e.total))
  //       },
  //     })

  //     if (isPublic) setImages((prevData) => [...res.data, ...prevData])
  //     setMyImages((prevData) => [...res.data, ...prevData])

  //     toast.success('이미지 업로드 성공!!')
  //     setTimeout(() => {
  //       setPercent(0)
  //       setPreviews([])
  //       // 동일한 이미지를 다시 올릴때 입력값의 변화가 없어서
  //       // onChange가 발동되지 않음.
  //       // inputRef를 사용하여 input 태그를 초기화 해줌.
  //       inputRef.current.value = null
  //     }, 1000)
  //   } catch (err) {
  //     console.log(err)
  //     toast.error(err.response.data.message)
  //     setPercent(0)
  //     setPreviews([])
  //     inputRef.current.value = null
  //   }
  // }

  const previewImages = previews.map((preview, index) => (
    <div key={index}>
      <img
        style={{ width: 200, height: 200, objectFit: 'cover' }}
        src={preview.imgSrc}
        alt=''
        className={`image-preview ${preview.imgSrc && 'image-preview-show'} `}
      />
      <ProgressBar percent={percent[index]} />
    </div>
  ))

  const fileName =
    previews.length === 0
      ? '이미지를 업로드 해주세요!!'
      : previews.reduce(
          (previews, current) => previews + `${current.fileName},`,
          ''
        )

  return (
    <form onSubmit={onSubmitV2}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
        }}
      >
        {previewImages}
      </div>

      <div className='file-dropper'>
        {fileName}
        <input
          ref={(ref) => (inputRef.current = ref)}
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
        disabled={isLoading}
      >
        제출
      </button>
    </form>
  )
}
