import React, { Component } from 'react';
import Board from '@asseinfo/react-kanban';
import '@asseinfo/react-kanban/dist/styles.css';

const board = {
    columns: [
      {
        id: 1,
        key:1,
        title: 'Backlog',
        cards: [
          {
            key:1,
            id: 1,
            title: 'Add card',
            description: 'Add capability to add a card in a column'
          },
        ]
      },
      {
        id: 2,
        key:2,
        title: 'Doing',
        cards: [
          {
            key:2,
            id: 2,
            title: 'Drag-n-drop support',
            description: 'Move a card between the columns'
          },
        ]
      },
      {
        id: 3,
        key:3,
        title: 'Doing',
        cards: [
          {
            key:3,
            id: 3,
            title: 'Drag-n-drop support',
            description: 'Move a card between the columns'
          },
        ]
      },
      {
        id: 4,
        key:4,
        title: 'Doing',
        cards: [
          {
            key:4,
            id: 4,
            title: 'Drag-n-drop support',
            description: 'Move a card between the columns'
          },
        ]
      }
    ]
  };

class Cards extends Component {






    render() {
        return (
            <>
                <Board key={this.props.key} initialBoard={board} />
            </>
        );
    }
}

export default Cards;