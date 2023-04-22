import React from 'react'

const Persons = ({ persons, deletePerson }) => {
  return (
    <div>
      {persons.map((person) => (
        <div key={person.id}>
          <div>{person.name} {person.number} <button onClick={() => deletePerson(person.id)}>delete</button></div>
        </div>
      ))}
    </div>
  )
}

export default Persons