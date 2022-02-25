import React from 'react'
import UploadForm from './components/UploadForm'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ImageList from './components/ImageList'

function App() {
  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <ToastContainer />
      <h2>ImageUpload</h2>
      <UploadForm />
      <ImageList />
    </div>
  )
}

export default App
