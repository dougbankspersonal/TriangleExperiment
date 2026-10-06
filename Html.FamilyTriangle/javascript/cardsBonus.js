define([
  "sharedJavascript/cards",
  "sharedJavascript/dieUtils",
  "sharedJavascript/debugLog",
  "sharedJavascript/htmlUtils",
  "dojo/domReady!",
], function (cards, debugLogModule, htmlUtils) {
  var debugLog = debugLogModule.debugLog;

  function addCardFront(parent, cardConfigs, index) {
    var cardConfig = cards.getCardConfigAtIndex(cardConfigs, index);
    var cardFrontNode = cards.addCardFront(
      parent,
      ["victory", "suprise", "tokens"],
      "victory-surpise-token",
    );

    return cardFrontNode;
  }

  function addCardBack(parent, index) {
    debugLog("addCardBack", "index = " + index);
    var cardBackNode = htmlUtils.addDiv(parent, ["card", "back", "bonus"]);

    var textNode = htmlUtils.addDiv(
      cardBackNode,
      ["text"],
      "bonus-text",
      "Bonus",
    );

    return cardBackNode;
  }

  return {
    addCardFront: addCardFront,
    addCardBack: addCardBack,
  };
});
