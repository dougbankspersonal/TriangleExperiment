define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/htmlUtils",
  "javascript/cardsBonusData",
  "dojo/domReady!",
], function (cards, debugLogModule, htmlUtils, cardsBonusData) {
  var debugLog = debugLogModule.debugLog;

  function addCardFront(parent, index) {
    var cardConfigs = cardsBonusData.getCardConfigs();
    var cardConfig = cards.getCardConfigAtIndex(cardConfigs, index);
    var cardFrontNode = cards.addCardFront(parent, ["bonus"], "bonus");

    var titleNode = htmlUtils.addDiv(
      cardFrontNode,
      ["title"],
      "bonus-title",
      cardConfig.title,
    );

    var textNode = htmlUtils.addDiv(
      cardFrontNode,
      ["text"],
      "bonus-text",
      cardConfig.text,
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
