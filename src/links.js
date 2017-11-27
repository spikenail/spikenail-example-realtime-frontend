import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { onError } from 'apollo-link-error';
import { getMainDefinition } from 'apollo-utilities';

export const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, location, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${location}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

export const subscriptionLink = (config = {}) =>
  new WebSocketLink({
    uri:
      process.env.NODE_ENV !== 'production'
        ? 'ws://localhost:8000/graphql?auth_token=igor-secret-token'
        : 'ws://SPIKENAIL_CARDS_API:8000/graphql',
    options: { reconnect: true },
    ...config,
  });

export const queryOrMutationLink = (config = {}) =>
  new ApolloLink((operation, forward) => {
    /*
     You can use a simple middleware link like this one to set credentials,
     headers, or whatever else you need on the context.
     All links in the chain will have access to the context.
     */
    operation.setContext({
      credentials: 'same-origin',
    });

    return forward(operation);
  }).concat(
    new HttpLink({
      uri: 'http://localhost:5000/graphql?auth_token=igor-secret-token',
      ...config,
    })
  );

export const requestLink = ({ queryOrMutationLink, subscriptionLink }) =>
  ApolloLink.split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    subscriptionLink,
    queryOrMutationLink
  );
