import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { ImageProvider } from './context/ImageContext'
import { AuthProvider } from './context/AuthContext'

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <ImageProvider>
        <App />
      </ImageProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
