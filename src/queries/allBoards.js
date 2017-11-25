import gql from 'graphql-tag';

export default gql`
  query allBoards {
    viewer {
      allBoards {
        edges {
          node {
            id
            name
            isPrivate
          }
        }
      }
    }
  }`;