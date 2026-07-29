// 207.846pxs

/*
Tightly bound with hoaDeckConfigConstruction.js

hoaDeckConfigConstruction describes a deck of cards in "HOA" specific terms.
This translates into an array of card configs using generic "triangle cards" terms, these can
be passed off to triangleCards shared code to generate actual cards.
*/
define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericUtils",
  "sharedJavascript/htmlUtils",
  "sharedJavascript/triangleCardUtils",
  "sharedJavascript/triangleCards",
  "dojo/domReady!",
], function (
  cards,
  debugLogModule,
  genericUtils,
  htmlUtils,
  triangleCardUtils,
  triangleCards,
) {
  function addPlayerCardBack(parentNode, cardIndex, playerIndex) {
    var classes = ["player-" + playerIndex.toString(), "family-triangle-card"];
    var cardBackNode = triangleCards.addCardBack(
      parentNode,
      cardIndex,
      classes,
    );

    var imageNode = htmlUtils.addImage(cardBackNode, [
      "player",
      "player-" + playerIndex.toString(),
    ]);

    return cardBackNode;
  }

  // This returned object becomes the defined value of this module
  return {
    addPlayerCardBack: addPlayerCardBack,
  };
});
