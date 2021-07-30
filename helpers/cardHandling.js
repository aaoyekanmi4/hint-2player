const _ = require('lodash');

//Fisher Yates shuffle
const shuffle = (array) => {
  var i = 0,
    j = 0,
    temp = null;

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

const dealCards = (cards, player1, player2) => {
  const player1Cards = [];
  const player2Cards = [];
  for (var i = 0; i < cards.length; i++) {
    player1Cards.push(cards[i]);
    i += 1;
    player2Cards.push(cards[i]);
  }
  return [
    { ...player1, cards: [...player1Cards] },
    { ...player2, cards: [...player2Cards] },
  ];
};


module.exports = {
  shuffle,
  dealCards
};