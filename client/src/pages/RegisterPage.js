import React, { useState, useContext } from 'react'
import CustomInput from '../components/CustomInput'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordCheck, setPasswordCheck] = useState('')

  const [, setMe] = useContext(AuthContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    try {
      e.preventDefault()
      if (username.length < 3)
        throw new Error('아이디를 3자 이상으로 해주세요!!')
      if (password.length < 6)
        throw new Error('비밀번호를 6자 이상으로 해주세요!!')
      if (password !== passwordCheck)
        throw new Error('비밀번호와 비밀번호 확인이 다릅니다. !!')

      const result = await axios.post('/users/register', {
        name,
        username,
        password,
      })

      // AuthContext에 저장
      setMe({
        userId: result.data.userId,
        sessionId: result.data.sessionId,
        name: result.data.name,
      })
      navigate('/')
      toast.success('회원가입 성공!!')
    } catch (err) {
      console.error(err)
      toast.error(err.message)
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
      <h3>회원가입</h3>
      <form onSubmit={submitHandler}>
        <CustomInput label='이름' value={name} setValue={setName} />
        <CustomInput label='아이디' value={username} setValue={setUsername} />
        <CustomInput
          label='비밀번호'
          value={password}
          setValue={setPassword}
          type='password'
        />
        <CustomInput
          label='비밀번호 확인'
          value={passwordCheck}
          setValue={setPasswordCheck}
          type='password'
        />
        <button type='submit'>회원가입</button>
      </form>
    </div>
  )
}
