import React from 'react'
import Header from './Header'
import Content from './Content'
import Total from './Total'

const Course = ({ course }) => {
  return (
    <div>
			<Header course={course[0]} />
			<Content parts={course[0].parts[0]} />
      <Content parts={course[0].parts[1]} />
      <Content parts={course[0].parts[2]} />
      <Content parts={course[0].parts[3]} />
			<Total parts={course[0].parts} />
      <Header course={course[1]} />
      <Content parts={course[1].parts[0]} />
      <Content parts={course[1].parts[1]} />
      <Total parts={course[1].parts} />
    </div>
  )
}

export default Course