import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import find from 'lodash.find';
import findIndex from 'lodash.findindex';

import BoardQuery from '../../../queries/getBoard';

import { Card, Button, Icon } from 'semantic-ui-react'

import EditForm from './EditForm';

class ListCard extends React.Component {
  state = {
    isActive: false,
  };

  toggle = () => {
    this.setState((prevState, props) => {
      return {
        isActive: !prevState.isActive
      }
    });
  };

  handleEditClick = () => {
    this.toggle();
  };

  onEditFinished = () => {
    this.toggle();
  };

  handleRemoveClick = () => {
    this.props.mutate({
      variables: { cardId: this.props.id },
      update: (store, result) => {

        const data = store.readQuery({ query: BoardQuery, variables: { id: this.props.boardId } });
        let list = find(data.getBoard.lists.edges, l => l.node.id === this.props.listId);

        const cardIndex = findIndex(list.node.cards.edges, c => c.node.id === this.props.id);

        if (!~cardIndex) {
          return;
        }

        // Remove card
        list.node.cards.edges.splice(cardIndex, 1);
        store.writeQuery({ query: BoardQuery, variables: { id: this.props.boardId }, data });
      }
    })
  };

  render() {
    return (
      <Card fluid>
        <Card.Content>
          <Card.Description title={ this.props.id }>
            {!this.state.isActive &&
              <div>
                { this.props.title }
                <Button icon onClick={this.handleEditClick}>
                  <Icon name='write' />
                </Button>
                <Button icon onClick={this.handleRemoveClick}>
                  <Icon name='remove' />
                </Button>
              </div>
            }

            {this.state.isActive && <EditForm card={this.props.card} onEditFinished={this.onEditFinished} /> }
          </Card.Description>
        </Card.Content>
      </Card>
    )
  }
}


const mutation = gql`
  mutation removeCard($cardId: ID!) {
    removeCard(input: { id: $cardId }) {
      removedId
    }
  }`;

export default graphql(mutation)(ListCard);
