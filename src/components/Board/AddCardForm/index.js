import React from 'react';

import { Button, Form, TextArea, Input } from 'semantic-ui-react';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import BoardQuery from '../../../queries/getBoard';

class AddCardForm extends React.Component {

  state = {
    value: '',
    isActive: false
  };

  componentDidUpdate() {
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };

  toggle = () => {
    this.setState((prevState, props) => {
      return {
        isActive: !prevState.isActive
      }
    });
  };

  onAddCardClick = () => {
    this.toggle();
  };

  handleCancelClick = () => {
    this.toggle();
  };

  handleAddClick = () => {
    this.toggle();

    this.props.mutate({
      variables: { title: this.state.value, listId: this.props.list.id },
      update: (store, result) => {

        let newEdge = {
          node: result.data.createCard.card,
          __typename: 'list_cardsEdge'
        };

        const data = store.readQuery({ query: BoardQuery, variables: { id: this.props.list.boardId } });

        for (let edge of data.getBoard.lists.edges) {
          if (edge.node.id == this.props.list.id) {
            edge.node.cards.edges.push(newEdge);

            store.writeQuery({ query: BoardQuery, variables: { id: this.props.list.boardId }, data });
            break;
          }
        }
      },
      optimisticResponse: {
        createCard: {
          __typename: "CreatecardPayload",
          card: {
            __typename: 'card',
            id: -Date.now() + '_card',
            listId: this.props.list.id,
            boardId: this.props.list.boardId,
            title: this.state.value
          }
        }
      }
    })
  };

  render() {
    return (
      <div>
        { this.state.isActive &&
          <Form>
            <Input
              fluid
              placeholder='Card title...'
              value={this.state.value}
              onChange={this.handleChange}
            />
            <Button onClick={this.handleAddClick}>Add</Button>
            <Button onClick={this.handleCancelClick}>X</Button>
          </Form>
        }

        { !this.state.isActive && <Button attached='bottom' onClick={this.onAddCardClick}>Add a card...</Button>}
      </div>
    )
  }
}

const mutation = gql`
  mutation createCard($listId: ID!, $title: String) {
    createCard(input: { listId: $listId, title: $title }) {
      card {
        id
        title
        listId
        boardId
      }
    }
  }`;

export default graphql(mutation)(AddCardForm);

