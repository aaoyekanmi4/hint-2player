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

const dealCards = (cards, players) => {
  const cardsCopy = [...cards]
  const playersCopy = _.cloneDeep(players)
  let playerIdx = 0
  while (cardsCopy.length > 0) {
    if (playerIdx === playersCopy.length) {
      playerIdx = 0
    }
    playersCopy[playerIdx].cards.push(cardsCopy.pop())
    playerIdx++
  }
  console.log(playersCopy)
  return playersCopy;
};


module.exports = {
  shuffle,
  dealCards
};
