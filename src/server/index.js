// Libs
import { createServer, Model } from 'miragejs';
import { buildSchema, graphql } from 'graphql';

// Data
import { countries } from './data/countries';

const graphqlSchema = buildSchema(`
  type Query {
    countries: [Country]
  }

  type Country {
    name: String
    code: String
  }
`);

export const mockedServer = (environment) => createServer({
  models: {
    country: Model,
  },
  seeds(server) {
    for (let i = 0; i < countries.length; i++) {
      const element = countries[i];

      server.create(
        'country',
        {
          ...element,
        }
      )
    }
  },
  routes() {
    this.post(`${process.env.REACT_APP_API}`, (schema, request) => {
      let requestJson = JSON.parse(request.requestBody);
      let query = requestJson.query;
      let variables = requestJson.variables;

      let resolver = {
        countries() {
          return schema.db.countries;
        }
      };

      return graphql(graphqlSchema, query, resolver, null, variables);
    });
  },
});