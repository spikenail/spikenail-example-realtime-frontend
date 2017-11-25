import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import findIndex from 'lodash.findindex';
import update from 'immutability-helper';

import BoardQuery from '../queries/getBoard';

import List from '../components/Board/List';
import LoadingScreen from '../components/LoadingScreen';
import ListsContainer from '../components/Board/ListsContainer';
import AddListForm from '../components/Board/AddListForm';
import BoardHeader from '../components/Board/Header';

import styled from 'styled-components';

const Wrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

const Content = styled.div`
  height: 100%;
  display: flex;
  box-orient: vertical;
  box-direction: normal;
  flex-direction: column;
  margin-right: 0;
  transition: margin .1s ease-in;
`;

class BoardPage extends React.Component {

  componentWillMount() {
    let params = {
      boardId: this.props.match.params.id
    };

    // this.props.subscribeToLists(params);
    this.props.subscribeToCards(params);
  }

  render() {
    const { board } = this.props;

    if (!board) {
      return <LoadingScreen />;
    }

    const lists = board.lists.edges.map(list => {
      return <List key={list.node.id} list={list.node} />
    });

    return (
      <Wrapper>
        <Content>
          <BoardHeader board={board} />
          <ListsContainer>
            {lists}
            <AddListForm board={board} />
          </ListsContainer>
        </Content>
      </Wrapper>
    )
  }
}

const CARDS_SUBSCRIPTION = gql`
  subscription subscribeToCard($filter: JSON) {
    subscribeToCard(filter: { where: $filter }) {
      mutation
      node {
        id
        title
        boardId
        listId
        board {
          id
          name
          isPrivate
        }
      }
    }
  }
`;

export default graphql(BoardQuery, {
  name: 'data',
  options: (props) => ({
    variables: { id: props.match.params.id }
  }),
  props: (props) => {
    return {
      subscribeToCards: params => {
        return props.data.subscribeToMore({
          document: CARDS_SUBSCRIPTION,
          variables: {
            "filter": `{ \"filter\":  { \"boardId\": \"${params.boardId}\" }}`
          },
          updateQuery: (prev, {subscriptionData}) => {
            let data = subscriptionData.subscribeToCard;

            const { node, mutation } = data;

            let lists = prev.getBoard.lists.edges;

            let listIndex = findIndex(lists, l => l.node.id === data.node.listId);

            let newEdge = {
              node: node,
              __typename: 'list_cardsEdge'
            };

            if (mutation === 'remove') {
              // TODO: Not implemented
              return prev;
            }

            // Update if item is already exists, if not create new
            let cardIndex = findIndex(lists[listIndex].node.cards.edges, c => c.node.id === node.id);

            // Create
            if (!~cardIndex) {
              return update(prev, {
                getBoard: {
                  lists: {
                    edges: {
                      [listIndex]: {
                        node: {
                          cards: {
                            edges: {
                              $push: [newEdge]
                            }
                          }
                        }
                      }
                    }
                  }
                }
              });
            }

            // Update
            return update(prev, {
              getBoard: {
                lists: {
                  edges: {
                    [listIndex]: {
                      node: {
                        cards: {
                          edges: {
                            [cardIndex]: {
                              node: {
                                $merge: node
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            });
          }
        })
      },
      board: props.data.getBoard
    }
  }
})(BoardPage);

