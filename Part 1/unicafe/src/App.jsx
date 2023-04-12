import { useState } from 'react'
import Statistics from './components/Statistics '
import Button from './components/Button'

function App() {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1);
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1);
  }

  const handleBadClick = () => {
    setBad(bad + 1);
  }

  const all = good + neutral + bad
  
  return (
    <div className="App">
      <h1>give feedback</h1>
      <Button 
        handleGoodClick={handleGoodClick}
        handleNeutralClick={handleNeutralClick}
        handleBadClick={handleBadClick}
      />
      <Statistics 
        good={good}
        neutral={neutral}
        bad={bad}
        all={all}
      />
    </div>
  )
}

export default App
