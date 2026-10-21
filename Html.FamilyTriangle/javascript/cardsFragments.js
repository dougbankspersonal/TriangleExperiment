define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/htmlUtils",
  "javascript/cardsFragmentsData",
  "dojo/domReady!",
], function (cards, debugLogModule, htmlUtils, cardsFragmentsData) {
  var debugLog = debugLogModule.debugLog;

  function addCardFront(parent, index, opt_flipped) {
    var flipped = opt_flipped || false;

    var cardConfigs = cardsFragmentsData.getCardConfigs();
    var cardConfig = cards.getCardConfigAtIndex(cardConfigs, index);
    debugLog("addCardFront", "cardConfig = ", JSON.stringify(cardConfig));
    var cardFrontNode = cards.addCardFront(
      parent,
      ["cards-fragments", cardConfig.terrainType],
      "cards-fragments",
    );

    var cardFrontWrapperNode = htmlUtils.addDiv(
      cardFrontNode,
      ["front-wrapper"],
      "front-wrapper",
    );

    for (var i = 0; i < cardConfig.dots.length; i++) {
      var dotType = cardConfig.dots[i];
      var dotIndex = flipped ? cardConfig.dots.length - 1 - i : i;
      var dotNode = htmlUtils.addDiv(
        cardFrontWrapperNode,
        ["dot", dotType, "position-" + dotIndex],
        "dot-" + dotIndex,
      );
    }

    return cardFrontNode;
  }

  return {
    addCardFront: addCardFront,
  };
});
