import React, { useState, useEffect } from 'react'

export default function Image({ imageUrl }) {
  const [isError, setIsError] = useState(false)
  const [hashedUrl, setHashedUrl] = useState(imageUrl)

  useEffect(() => {
    let intervalId

    if (isError && intervalId) {
      setIsError(() => {
        intervalId = setInterval(() => setHashedUrl(`${imageUrl}#${Date.now}`))
      }, 1000)
    } else if (!isError && intervalId) clearInterval(intervalId)
    else setHashedUrl(imageUrl)
    return () => clearInterval(intervalId)
  }, [isError, setHashedUrl, imageUrl])

  return (
    <img
      alt=''
      src={hashedUrl}
      onError={() => setIsError(true)}
      onLoad={() => setIsError(false)}
      style={{ display: isError ? 'none' : 'block' }}
    />
  )
}
