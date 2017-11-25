import React from 'react';
import { graphql } from 'react-apollo';
import find from 'lodash.find';
import findIndex from 'lodash.findindex';

import { Form, Button, Input, Icon } from 'semantic-ui-react'

import BoardQuery from '../../../../queries/getBoard';
import updateCardMutation from '../../../../queries/updateCardMutation';

class EditForm extends React.Component {

  state = {
    value: this.props.card.title || ''
  };

  handleCancelClick = () => {
    this.props.onEditFinished();
  };

  handleSaveClick = () => {
    this.props.onEditFinished();

    this.props.mutate({
      variables: {
        input: { id: this.props.card.id, title: this.state.value }
      },
      update: (store, result) => {
        const listId = this.props.card.listId;

        const data = store.readQuery({ query: BoardQuery, variables: { id: this.props.card.boardId } });

        let list = find(data.getBoard.lists.edges, e => e.node.id === listId);

        const cardIndex = findIndex(list.node.cards.edges, e => e.node.id === this.props.card.id);

        list.node.cards.edges[cardIndex].node = result.data.updateCard.card;

        store.writeQuery({ query: BoardQuery, variables: { id: this.props.card.boardId }, data });
      },
      // TODO: optimisticResponse
    });
  };

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };

  render() {
    return (
      <Form>
          <Input
            fluid
            value={this.state.value}
            onChange={this.handleChange}
          />
          <Button onClick={this.handleSaveClick}>
            Save
          </Button>
          <Button icon onClick={this.handleCancelClick}>
            <Icon name="remove" />
          </Button>
      </Form>
    );
  }
}

export default graphql(updateCardMutation)(EditForm);