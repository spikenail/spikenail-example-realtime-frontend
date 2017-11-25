import gql from 'graphql-tag';

export default gql`
  query getBoard($id: String!){
    getBoard (id: $id) {
      id
      isPrivate
      name
      lists {
        edges {
          node {
            id
            boardId
            name
            cards {
              edges {
                node {
                  id
                  listId
                  title
                  boardId
                }
              }
            }
          }
        }
      }
    }
  }`;