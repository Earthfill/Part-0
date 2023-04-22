import axios from 'axios'

const baseUrl = 'https://restcountries.com/v3.1/all'
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q='
const API_KEY = process.env.REACT_APP_API_KEY;

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const getApi = (city) => {
  const request = axios.get(`${apiUrl}${city}&APPID=${API_KEY}`)
  return request.then(response => response.data)
}

export default { getAll, getApi }