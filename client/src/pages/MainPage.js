import React from 'react'
import ImageList from '../components/ImageList'
import UploadForm from '../components/UploadForm'

export default function MainPage() {
  return (
    <div>
      <h2>ImageUpload</h2>
      <UploadForm />
      <ImageList />
    </div>
  )
}
