import gql from 'graphql-tag';

export default gql`
  mutation updateCard($input: UpdatecardInput!) {
    updateCard(input: $input) {
      card {
        id
        listId
        boardId
        title
      }
    }
  }`;