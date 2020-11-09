import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  GraphQLClient,
  gql
} from 'graphql-request'

import { mockedServer } from './server/';

// initialize a GraphQL client
const client = new GraphQLClient(`${process.env.REACT_APP_API}`, {
  headers: {},
});

// write a GraphQL query that asks for names and codes for all countries
const LIST_COUNTRIES = gql`
  {
    countries {
      name
      code
    }
  }
`;

if (process.env.NODE_ENV === 'development') {
  mockedServer(); 
}

// create a component that renders a select input for coutries
function CountrySelect() {
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState('US');
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.request(
          LIST_COUNTRIES,
          {}
        );

        setCountries(response.countries);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [])

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <select value={country} onChange={event => setCountry(event.target.value)}>
      {countries.map(country => (
        <option key={country.code} value={country.code}>
          {country.name}
        </option>
      ))}
    </select>
  );

  
}

ReactDOM.render(<CountrySelect />, document.getElementById('root'));