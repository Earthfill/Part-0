require('dotenv').config();
const express = require('express')
const morgan = require('morgan');
const cors = require('cors')

const Person = require('./models/person');

const app = express()

morgan.token('body', (request) => JSON.stringify(request.body));

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));
app.use(cors())
app.use(requestLogger)

app.get('/info', (request, response) => {
  const now = new Date();
  
  Person.countDocuments()
    .then(count => {
      response.send(`<p>Phonebook has info for ${count} people</p><p>${now}</p>`)
    })
    .catch(error => {
      console.log(error)
      response.status(500).send("Internal Server Error")
    })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.number || !body.number.match(/^[0-9-]+$/) || body.number.length < 8) {
    return response.status(400).json({ error: 'Invalid phone number. A phone number must have a length of 8 or more and consist of numbers and hyphens (-).' })
  }
  
  Person.findOne({ name: body.name })
    .then(existingPerson => {
      if (existingPerson) {
        return response.status(409).json({ error: 'Person already exists in the database' })
      }

      const person = new Person({
        name: body.name,
        number: body.number
      })

    person.save()
      .then(savedPerson => {
        response.json(savedPerson)
      })
      .catch(error => next(error))
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})