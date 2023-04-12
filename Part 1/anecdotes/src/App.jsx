import { useState } from 'react'

function App() {
  const anecdotes = [ 
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [vote, setVote] = useState(new Array(anecdotes.length).fill(0))

  const randomNumber = Math.floor(Math.random() * 8);

  const currentIndex = anecdotes.indexOf(anecdotes[selected]);
  const maxVoteIndex = vote.indexOf(Math.max(...vote));

  const handleClick = () => {
    setSelected(randomNumber)
  }

  const handleVote = () => {
    const updatedVote = [...vote];
    updatedVote[selected] += 1;
    setVote(updatedVote)
  }

  console.log(vote)
  return (
    <div className="App">
      <h1>Annecdote of the day</h1>
      {anecdotes[selected]}
      <div>
        <p>has {vote[currentIndex]} votes</p>
        <button onClick={handleVote}>
          vote
        </button>
        <button onClick={handleClick}>
          next anecdote
        </button>
      </div>
      <h1>Annecdote with most votes</h1>
      <p>{anecdotes[maxVoteIndex]}</p>
      <p>has {vote[currentIndex]} votes</p>
    </div>
  )
}

export default App
