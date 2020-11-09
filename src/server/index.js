// Libs
import { createServer, Model } from 'miragejs';

// Data
import { countries } from './data/countries';

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
    this.post(`${process.env.REACT_APP_API}`, (schema) => {
      return {
        books: schema.countries.all().models
      };
    });
  },
});