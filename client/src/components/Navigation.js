import React, { useContext } from 'react'
import { Link } from 'react-router-dom'

import { AuthContext } from '../context/AuthContext'
import { toast } from 'react-toastify'
import axios from 'axios'

export default function Navigation() {
  const [me, setMe] = useContext(AuthContext)

  const logoutHandler = async () => {
    try {
      await axios.post(
        '/users/logout',
        {},
        { headers: { sessionid: me.sessionId } }
      )
      setMe()
      toast.success('로그아웃')
    } catch (err) {
      console.error(err)
      toast.error(err.message)
    }
  }

  return (
    <div>
      <Link to='/'>
        <span>Home</span>
      </Link>

      {me ? (
        <span
          style={{ float: 'right', cursor: 'pointer' }}
          onClick={logoutHandler}
        >
          로그아웃({me.name})
        </span>
      ) : (
        <>
          <Link to='/auth/login'>
            <span style={{ float: 'right' }}>Login</span>
          </Link>

          <Link to='/auth/register'>
            <span style={{ float: 'right', marginRight: 10 }}>Register</span>
          </Link>
        </>
      )}
    </div>
  )
}
