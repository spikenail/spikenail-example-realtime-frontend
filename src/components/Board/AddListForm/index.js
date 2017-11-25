import React, { Component } from 'react';
import { graphql } from 'react-apollo';

import { Form, Button, Input, Icon } from 'semantic-ui-react'

import createListMutation from '../../../queries/createListMutation';
import getBoardQuery from '../../../queries/getBoard';

import styled from 'styled-components';

const ListWrapper = styled.div`
  width: 270px;
  margin: 0 5px;
  height: 100%;
  box-sizing: border-box;
  display: inline-block;
  vertical-align: top;
  white-space: nowrap;
  box-direction: normal;
`;

class AddListForm extends Component {

  state = {
    isActive: false,
    value: ''
  };

  toggle = () => {
    this.setState((prevState, props) => {
      return {
        isActive: !prevState.isActive
      }
    });
  };

  handleSaveClick = () => {
    this.toggle();

    const { board } = this.props;

    this.props.mutate({
      variables: {
        input: { boardId: board.id, name: this.state.value }
      },
      update: (store, result) => {
        const data = store.readQuery({
          query: getBoardQuery,
          variables: { id: board.id }
        });

        let newEdge = {
          node: Object.assign(
            {},
            result.data.createList.list,
            {
              cards: {
                __typename: "list_cardsConnection",
                edges: []
              }
            }),
          __typename: 'board_listsEdge'
        };

        data.getBoard.lists.edges.push(newEdge);

        store.writeQuery({
          query: getBoardQuery,
          variables: { id: this.props.board.id },
          data
        });
      },
      optimisticResponse: {
        createList: {
          __typename: "CreatelistPayload",
          list: {
            __typename: 'list',
            id: -1 - Date.now(),
            boardId: board.id,
            name: this.state.value,
            cards: {
              __typename: "list_cardsConnection",
              edges: []
            }
          }
        }
      }
    });

  };

  handleCancelClick = () => {
    this.toggle();
  };

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };

  render() {
    return (
      <ListWrapper>
        {
          this.state.isActive &&
          <Form>
            <Input fluid value={this.state.value} onChange={this.handleChange}/>
            <Button onClick={this.handleSaveClick}>
              Save
            </Button>
            <Button icon onClick={this.handleCancelClick}>
              <Icon name="remove"/>
            </Button>
          </Form>
        }

        {
          !this.state.isActive &&
          <a onClick={this.toggle}> Add a list...</a>
        }
      </ListWrapper>
    )
  }
}

export default graphql(createListMutation)(AddListForm);