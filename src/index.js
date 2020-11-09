import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {
  ApolloClient,
  InMemoryCache,
  gql,
  useQuery,
} from '@apollo/client';

import { mockedServer } from './server/';

// initialize a GraphQL client
const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: `${process.env.REACT_APP_API}`
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
  const [country, setCountry] = useState('US');
  const {data, loading, error} = useQuery(LIST_COUNTRIES, {client});

  if (loading || error) {
    return <p>{error ? error.message : 'Loading...'}</p>;
  }

  return (
    <select value={country} onChange={event => setCountry(event.target.value)}>
      {data.countries.map(country => (
        <option key={country.code} value={country.code}>
          {country.name}
        </option>
      ))}
    </select>
  );
}

ReactDOM.render(<CountrySelect />, document.getElementById('root'));