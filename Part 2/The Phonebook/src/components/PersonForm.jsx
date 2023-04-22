import React from 'react'

const PersonForm = ({ handleSubmit, newPerson, handlePersonChange, handleNumberChange, newNumber }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input
          type='text' 
          name='name'
          value={newPerson}
          onChange={handlePersonChange}
          required
        />
      </div>
      <div>
        number: <input 
          type='text'
          name='number'
          value={newNumber}
          onChange={handleNumberChange}
          required
      />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default PersonForm