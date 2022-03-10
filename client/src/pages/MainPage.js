import React, { useContext } from 'react'
import ImageList from '../components/ImageList'
import UploadForm from '../components/UploadForm'
import { AuthContext } from '../context/AuthContext'

export default function MainPage() {
  const [me] = useContext(AuthContext)

  return (
    <div>
      <h2>ImageUpload</h2>
      {me && <UploadForm />}
      <ImageList />
    </div>
  )
}
