import React, { Component } from 'react';

export default class VisibilitySwitcher extends Component {

  render() {

    const { board } = this.props;

    return (
      <div>
        { board.isPrivate ? 'private' : 'public' }
      </div>
    )
  }
}