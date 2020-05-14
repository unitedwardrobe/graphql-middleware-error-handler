# graphql-middleware-error-handler

This is a generic GraphQL middleware to handle errors that happen in resolvers.

It can be used with any error logging service (e.g. Sentry, Bugsnag).

## Usage

This example uses `graphql-yoga` but it should be compatible with any other
library that supports `graphql-middleware`.

```ts
import { GraphQLServer } from 'graphql-yoga';
import { errorHandler } from 'graphql-middleware-error-handler';

const typeDefs = `
  type Query {
    info: String!
    error: String!
  }
`;

const resolvers = {
  Query: {
    hello: () => 'I am a GraphQL Server',
    error: () => {
      throw new Error('This was not supposed to happen');
    },
  },
};

const errorHandlerMiddleware = errorHandler({
  onError: (error, context) => {
    // send error anywhere
  },
  captureReturnedErrors: true,
  forwardErrors: false,
});

const server = GraphQLServer({
  typeDefs,
  resolvers,
  middlewares: [errorHandlerMiddleware],
});

server.start(() => 'Server running');
```

## Options

### `onError`

The only required option, the function that is called when an error occurs. It's
called with the error as first argument, and the GraphQL context as the second.

### `captureReturnedErrors`

Determines if a resolver returns an error instead of throwing one it should
also be captured. Defaults to `false`.

### `forwardErrors`

Determines if the error should be rethrown after is was captured by the
middleware. Defaults to `false`.

## License

This project is licensed under the [MIT License](LICENSE.md).
