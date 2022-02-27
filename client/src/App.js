import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MainPage from './pages/MainPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Navigation from './components/Navigation'

import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <div style={{ maxWidth: 600, margin: 'auto' }}>
        <Navigation />
        <ToastContainer />
        <Routes>
          <Route path='/' element={<MainPage />} />
          <Route path='/auth/register' element={<RegisterPage />} />
          <Route path='/auth/login' element={<LoginPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
