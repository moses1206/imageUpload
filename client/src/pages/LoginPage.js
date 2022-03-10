import React, { useState, useContext } from 'react'
import CustomInput from '../components/CustomInput'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [, setMe] = useContext(AuthContext)

  const submitHandler = async (e) => {
    try {
      e.preventDefault()

      if (username.length < 3 || password.length < 6)
        throw new Error('입력정보가 올바르지 않습니다.!!')

      const result = await axios.post('/users/login', { username, password })

      setMe({
        name: result.data.name,
        sessionId: result.data.sessionId,
        userId: result.data.userId,
      })
      navigate('/')
      toast.success('로그인 성공!!')
    } catch (err) {
      console.error(err.response)
      toast.error(err.response.data.message)
    }
  }

  return (
    <div
      style={{
        marginTop: 100,
        maxWidth: 350,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <h3>로그인</h3>
      <form onSubmit={submitHandler}>
        <CustomInput label='아이디' value={username} setValue={setUsername} />
        <CustomInput
          label='비밀번호'
          value={password}
          setValue={setPassword}
          type='password'
        />

        <button type='submit'>로그인</button>
      </form>
    </div>
  )
}
