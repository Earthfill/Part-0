import React from 'react'

const Total = ({ parts }) => {
	const total = parts.reduce((init, total) => init + total.exercises, 0)
 
	return ( 
    <h4>total of {total} exercises</h4>
  )
}

export default Total