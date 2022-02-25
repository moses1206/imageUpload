import React, { useContext } from 'react'
import { ImageContext } from '../context/ImageContext'

export default function ImageList() {
  const [images] = useContext(ImageContext)

  const imgList = images.map((img) => (
    <img
      alt='mong'
      key={img.key}
      style={{ width: '100%' }}
      src={`http://localhost:5000/uploads/${img.key}`}
    />
  ))

  return (
    <div>
      <h3>Image List</h3>
      {imgList}
    </div>
  )
}
