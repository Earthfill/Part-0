const express = require('express')
const morgan = require('morgan');

const app = express()

morgan.token('body', (request) => JSON.stringify(request.body));

// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
// }

// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: 'unknown endpoint' })
// }

app.use(express.json())
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));
// app.use(requestLogger)

let data = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/info', (request, response) => {
  const now = new Date();
  const entries = data.length;
  response.send(`<p>Phonebook has info for ${entries} people</p><p>${now}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(data)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = data.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  data = data.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const min = 1;
  const max = 50;
  const randomId = data.length > 0
    ? Math.floor(Math.random(...data.map(n => n.id)) * (max - min + 1))
    : 0
  return randomId
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  } 
  
  const nameExists = data.find(person => person.name === body.name)
  if (nameExists) {
    return response.status(404).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  data = data.concat(person)

  response.json(person)
})

// app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})