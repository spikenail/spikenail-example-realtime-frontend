import React, { Component } from 'react';

import { Card } from 'semantic-ui-react'

import { Link } from 'react-router-dom'

export default class BoardCard extends Component {
  render() {
    const { id, name, isPrivate } = this.props;
    return (
      <Link to={`board/${id}`}>
        <Card
          header={name}
          meta={isPrivate ? 'Private' : 'Public'}
        />
      </Link>
    )
  }
}