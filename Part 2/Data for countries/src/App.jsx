import { useEffect, useState } from 'react'
import countryService from './services/country'

function App() {
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [showDetails, setShowDetails] = useState(false);

  const [weather, setWeather] = useState([])

  useEffect(() => {
    countryService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
        setFilteredCountries(initialCountries)
      })
  }, [])

  const getWeatherData = (city) => {
    const capital = country.capital;
    countryService
      .getApi(capital)
      .then(initialWeather => {
        setWeather(initialWeather)
      })
  }

  const handleFilterChange = (event) => {
    const filteredCountries = countries.filter(country =>
      country?.name?.common?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchTerm(event.target.value)
    setFilteredCountries(filteredCountries)
  }

  const renderCountryDetails = () => {
    if (filteredCountries.length === 1) {
      const country = filteredCountries[0];
      return (
        <div>
          <h2>{country?.name?.common}</h2>
          <p>capital {country?.capital}</p>
          <p>area {country?.area}</p>
          <h3>languages:</h3>
            <ul>
              {Object.entries(country?.languages).map(([key, value]) => (
              <li key={key}>
                {value}
              </li>
            ))}
            </ul>
          <img src={country?.flags?.svg} alt={`${country?.common} flag`} height="100" />
          <h2>Weather in {country?.capital}</h2>
          <p>temperature {weather?.main?.temp}</p>
        </div>
      );
    }
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div>
      <h1>{countries?.name?.common}</h1>
      find countries <input
        type='text'
        value={searchTerm}
        onChange={handleFilterChange}
      />
      {searchTerm === '' ? (
        <p></p>
      ) : filteredCountries.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : filteredCountries.length === 1 ? (
        renderCountryDetails()
      ) : (
        <ul>
          {filteredCountries.map(country => (
            <li key={country.area}>
              {country.name.common}
              <button onClick={toggleDetails}>{showDetails ? "Hide" : "Show"}</button>  
            </li>
          ))} 
        </ul>
      )}

    </div>
  )
}

export default App
