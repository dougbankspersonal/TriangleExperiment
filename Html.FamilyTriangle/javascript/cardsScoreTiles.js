define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/htmlUtils",
  "javascript/cardsScoreTilesData",
  "dojo/domReady!",
], function (cards, debugLogModule, htmlUtils, cardsScoreTilesData) {
  var debugLog = debugLogModule.debugLog;

  function addCardFront(parent, index) {
    var cardConfigs = cardsScoreTilesData.getCardConfigs();
    var cardConfig = cards.getCardConfigAtIndex(cardConfigs, index);
    debugLog("addCardFront", "cardConfig = ", JSON.stringify(cardConfig));
    var cardFrontNode = cards.addCardFront(
      parent,
      ["cards-score-tiles", cardConfig.terrainType],
      "cards-score-tiles",
    );

    var cardFrontWrapperNode = htmlUtils.addDiv(
      cardFrontNode,
      ["front-wrapper"],
      "front-wrapper",
    );

    // add dots.
    for (var i = 0; i < cardConfig.dots.length; i++) {
      var dotType = cardConfig.dots[i];
      var dotNode = htmlUtils.addDiv(
        cardFrontWrapperNode,
        ["dot", dotType, "position-" + i],
        "dot-" + i,
      );
    }

    return cardFrontNode;
  }

  return {
    addCardFront: addCardFront,
  };
});
