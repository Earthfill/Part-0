import React from 'react'

const Button = ({ handleGoodClick, handleNeutralClick, handleBadClick }) => {
  return (
    <div>
      <button onClick={handleGoodClick}>good</button>
      <button onClick={handleNeutralClick}>neutral</button>
      <button onClick={handleBadClick}>bad</button>
    </div>
  )
}

export default Button