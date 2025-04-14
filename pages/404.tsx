import React, { useEffect } from 'react'

const Custom404 = () => {
  useEffect(() => {
    window.location.href = `${new URL(window.location.href).origin}`
  }, [])

  return <></>
}

export default Custom404
