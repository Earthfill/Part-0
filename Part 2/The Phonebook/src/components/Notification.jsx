import React from 'react'

const Notification = ({ message, error }) => {
  if (message === null) {
    return null
  }

  return (
    <div>
      <div className={message !== null ? 'notification' : 'error'}>
        <div>{message}</div>
        <div>{error}</div>
      </div>
    </div>
  )
}

export default Notification