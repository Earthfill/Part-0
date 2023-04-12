import React from 'react'

const StatisticLine = ({ text, value }) => {
  return (
    <td>
      {text} {value}
    </td>
  )
}

export default StatisticLine