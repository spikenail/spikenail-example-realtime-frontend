import React from 'react';

import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  box-flex: 1;
  flex-grow: 1;
`;

const Inner = styled.div`
  user-select: none;
  white-space: nowrap;
  margin-bottom: 10px;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 10px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

export default class ListsContainer extends React.Component {

  render() {
    return (
      <Wrapper>
        <Inner>
          {this.props.children}
        </Inner>
      </Wrapper>
    )
  }
}


