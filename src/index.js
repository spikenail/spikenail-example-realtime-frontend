import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import { BrowserRouter } from 'react-router-dom'

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';

import Layout from './routes/Layout'

import 'semantic-ui-css/semantic.min.css';

import {
  errorLink,
  queryOrMutationLink,
  subscriptionLink,
  requestLink,
} from './links';

const link = ApolloLink.from([
  errorLink,
  requestLink({
    queryOrMutationLink: queryOrMutationLink(),
    subscriptionLink: subscriptionLink(),
  }),
]);

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
});

ReactDOM.render((
  <ApolloProvider client={client}>
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  </ApolloProvider>
), document.getElementById('root'));

registerServiceWorker();
