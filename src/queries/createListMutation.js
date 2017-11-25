import gql from 'graphql-tag';

export default gql`
  mutation createList($input: CreatelistInput!) {
    createList(input: $input) {
      list {
        id
        boardId
        name
      }
    }
  }`
;