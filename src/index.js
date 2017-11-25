import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import { BrowserRouter } from 'react-router-dom'

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { split } from 'apollo-link';

import Layout from './routes/Layout'

import 'semantic-ui-css/semantic.min.css';

const httpLink = new HttpLink({ uri: 'http://localhost:5000/graphql?auth_token=igor-secret-token' });
const wsLink = new WebSocketLink({
  uri: `ws://localhost:8000/graphql?auth_token=igor-secret-token`,
  options: {
    reconnect: true
  }
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);

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
