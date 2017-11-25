import React, { Component } from 'react';

import VisibilitySwitcher from './VisibilitySwitcher';

export default class Header extends Component {

  render() {
    const { board } = this.props;

    return (
      <div>
        { board.name }
        <VisibilitySwitcher board={board} />
      </div>
    )
  }
}