import React from 'react';

import styled from 'styled-components';

import ListCard from '../Card';
import AddCardForm from '../AddCardForm';

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

const ListContent = styled.div`
  background: #E2E4E6;
  border-radius: 3px;
  box-sizing: border-box;
  display: flex;
  box-orient: vertical;
  flex-direction: column;
  max-height: 100%;
  position: relative;
  white-space: normal;
`;

const CardsWrapper = styled.div`
  box-flex: 1;
  flex: 1 1 auto;
  overflow-y: auto;
  overflow-x: hidden;
  margin: 0 4px;
  padding: 0 4px;
  z-index: 1;
  min-height: 0;
  
  ::-webkit-scrollbar {
    height: 9px;
    width: 9px;
  }
  
  ::-webkit-scrollbar-track-piece {
    background: #D6DADC;
  }
}
`;

export default class List extends React.Component {
  render() {

    let cards = this.props.list.cards.edges;

    return(
      <ListWrapper>
        <ListContent>
          <div>
            { this.props.list.name }
          </div>
          <CardsWrapper>
            { cards.map((card) => {
              return <ListCard key={card.node.id} { ...card.node } card={card.node} />
            }) }
          </CardsWrapper>
          <div>
            <AddCardForm list={this.props.list} />
          </div>
        </ListContent>
      </ListWrapper>
    );
  }
}