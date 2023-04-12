import React from 'react'
import StatisticLine from './StatisticLine'

const Statistics  = ({ good, neutral, bad, all }) => {
  return (
    <div>
			<h1>statistics</h1>
			{all > 0 ?
			<table>
				<tbody>
					<tr><StatisticLine text="good" value={good} /></tr>
					<tr><StatisticLine text="neutral" value={neutral} /></tr>
					<tr><StatisticLine text="bad" value={bad} /></tr>
					<tr><StatisticLine text="all" value={all} /></tr>
					<tr><StatisticLine text="average" value={(good-bad)/all} /></tr>
					<tr><StatisticLine text="positive" value={good/all*100} /></tr>
				</tbody>
			</table> : "No feedback given"
			}
		</div>
  )
}

export default Statistics