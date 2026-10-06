define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/htmlUtils",
  "dojo/domReady!",
], function (cards, debugLogModule, htmlUtils) {
  var debugLog = debugLogModule.debugLog;

  function addCardFront(parent, cardConfigs, index) {
    var cardConfig = cards.getCardConfigAtIndex(cardConfigs, index);
    console.assert(cardConfig, "Card config should not be null or undefined");
    console.assert(
      cardConfig.classes,
      "Card config should have classes defined",
    );

    var cardFrontNode = cards.addCardFront(
      parent,
      cardConfig.classes,
      "victory-card",
    );

    debugLog("addCardFront", "cardConfig = ", JSON.stringify(cardConfig));

    htmlUtils.applyBasicConfig(cardFrontNode, cardConfig);

    return cardFrontNode;
  }

  function addCardBack(parent, index) {}

  return {
    addCardFront: addCardFront,
    addCardBack: addCardBack,
  };
});
