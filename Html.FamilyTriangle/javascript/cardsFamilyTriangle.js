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
  var debugLog = debugLogModule.debugLog;
  function addPlayerCardBack(parentNode, cardIndex, playerIndex) {
    debugLog("addPlayerCardBack", "cardIndex = ", cardIndex);
    debugLog("addPlayerCardBack", "playerIndex = ", playerIndex);
    var classes = ["player-" + playerIndex.toString(), "family-triangle"];
    var cardBackNode = triangleCards.addTriangleCardBack(
      parentNode,
      cardIndex,
      classes,
      function (wrapperNode) {
        // Insert the player's image.
        var imageNode = htmlUtils.addImage(wrapperNode, [
          "player",
          "player-" + playerIndex.toString(),
          "single-sector-insert",
        ]);
        console.assert(
          cardBackNode,
          "addPlayerCardBack failed to create imageNode",
        );
        return imageNode;
      },
    );

    console.assert(
      cardBackNode,
      "addPlayerCardBack failed to create cardBackNode",
    );
    return cardBackNode;
  }

  // This returned object becomes the defined value of this module
  return {
    addPlayerCardBack: addPlayerCardBack,
  };
});
