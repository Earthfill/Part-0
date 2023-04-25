import { useState, useEffect } from 'react'
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import personService from './services/persons'
import Notification from './components/Notification';

function App() {
  const [persons, setPersons] = useState([])
  const [newPerson, setNewPerson] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const [searchTerm, setSearchTerm] = useState("");

  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(person => person.name === newPerson);
    
    if (existingPerson) {
      const replaceNumber = window.confirm(
        `${newPerson} is already added to phonebook, replace the old number with a new one?`
      );
      if (replaceNumber) {
        const updatedPerson = { ...existingPerson, number: newNumber };
        personService
          .update(existingPerson.id, updatedPerson)
          .then(editedPerson => {
            setPersons(persons.map((person) => person.id !== existingPerson.id ? person : editedPerson));
            setNewPerson('');
            setNewNumber('');
            setNotificationMessage(`Updated ${newPerson}`);
            setTimeout(() => {
              setNotificationMessage(null);
            }, 5000);
          })
          .catch((error) => {
            setErrorMessage(
              `Information of ${newPerson} has already been removed from server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            setPersons(persons.filter(n => n.id === existingPerson.id))
          })
      }
    } else {
        const noteObject = {
          name: newPerson,
          number: newNumber
        }
        personService
          .create(noteObject)
          .then(returnedPerson => {
            setPersons(persons.concat(returnedPerson))
            setNewPerson('')
            setNewNumber('')
            setNotificationMessage(`Added ${newPerson}`);
            setTimeout(() => {
              setNotificationMessage(null);
            }, 5000);
          })
          .catch(error => {
            setErrorMessage(`Failed to add ${newPerson}`)
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
            setPersons(persons.filter(n => n.id === id))
          })
      } 
  }

  const handlePersonChange = (event) => {
    setNewPerson(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };


  const handleFilterChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const filteredPeople = persons.filter(person =>
    person?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deletePerson = (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this item?');
    if (confirmed) {
      personService
        .remove(id)
        .then(changedPerson => {
          setPersons(persons.filter(person => person.id !== id));
        })
        .catch(error => {
          console.log(error);
        })
    }
  }
  
  return (
    <div className="App">
      <h2>Phonebook</h2>
      <Notification 
        message={notificationMessage}
        error={errorMessage}  
      />
      <Filter 
        searchTerm={searchTerm}
        handleFilterChange={handleFilterChange}
        filteredPeople={filteredPeople}
      />
      <h1>add a new</h1>
      <PersonForm 
        handleSubmit={handleSubmit}
        newPerson={newPerson}
        newNumber={newNumber}
        handlePersonChange={handlePersonChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        deletePerson={deletePerson}
      />
    </div>
  )
}

export default App
