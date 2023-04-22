import React from 'react'

const Filter = ({ searchTerm, handleFilterChange, filteredPeople }) => {
  return (
    <div>
      filter shown with <input
        value={searchTerm}
        onChange={handleFilterChange}
      />
      {searchTerm === '' ? <p></p>:
      <ul>
				{filteredPeople.map(person => (
        <li key={person.id}>{person.name}</li>
				))}
			</ul>
			}
    </div>
  )
}

export default Filter