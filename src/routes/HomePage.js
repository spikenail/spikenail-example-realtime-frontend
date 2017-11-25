import React, { Component } from 'react';
import { graphql } from 'react-apollo';

import LoadingScreen from '../components/LoadingScreen';
import BoardCard from '../components/HomePage/BoardCard'

import allBoardsQuery from '../queries/allBoards';

import get from 'lodash.get';

class HomePage extends Component {

  render() {
    const { boards } = this.props;

    if (!boards) {
      return <LoadingScreen />;
    }

    return (
      <div>
        { boards.map(({ node }) =>
          <BoardCard {...node} key={node.id} />
        )}
      </div>
    )
  }
}

export default graphql(allBoardsQuery, {
  props: ({ ownProps, data }) => ({
    boards: get(data, 'viewer.allBoards.edges'),
  })
})(HomePage)