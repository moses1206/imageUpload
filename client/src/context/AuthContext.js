import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [me, setMe] = useState()

  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId')

    if (me) {
      // 자바스크립트 이벤트 루프
      axios.defaults.headers.common.sessionid = me.sessionId
      localStorage.setItem('sessionId', me.sessionId)
    } else if (sessionId) {
      axios
        .get('/users/me', { headers: { sessionid: sessionId } })
        .then((result) =>
          setMe({
            name: result.data.name,
            userId: result.data.userId,
            sessionId: result.data.sessionId,
          })
        )
        .catch((err) => {
          console.log(err)
          localStorage.removeItem('sessionId')
          delete axios.defaults.headers.common.sessionid
        })
    } else {
      delete axios.defaults.headers.common.sessionid
    }
  }, [me])

  return (
    <AuthContext.Provider value={[me, setMe]}>{children}</AuthContext.Provider>
  )
}
