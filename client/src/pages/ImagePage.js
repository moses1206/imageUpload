import React from 'react'
import { useParams } from 'react-router-dom'

export default function ImagePage() {
  const { imageId } = useParams()
  return (
    <div>
      <h3>Image Page</h3>
    </div>
  )
}
