define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/htmlUtils",
  "javascript/gameInfo",
  "javascript/cardsScoringData",
  "dojo/domReady!",
], function (cards, debugLogModule, htmlUtils, gameInfo, cardsScoringData) {
  var debugLog = debugLogModule.debugLog;

  function addCardFront(parent, index) {
    var cardConfigs = cardsScoringData.getCardConfigs();
    var cardConfig = cards.getCardConfigAtIndex(cardConfigs, index);
    var cardFrontNode = cards.addCardFront(
      parent,
      ["scoring", "player-" + cardConfig.playerIndex],
      "scoring",
    );

    var textNode = htmlUtils.addDiv(
      cardFrontNode,
      ["text"],
      "scoring-text",
      cardConfig.text,
    );

    var symbolNode = htmlUtils.addImage(
      cardFrontNode,
      ["player-icon-" + cardConfig.playerIndex, "scoring-symbol"],
      "scoring-symbol",
    );

    return cardFrontNode;
  }

  function addCardBack(parent, index) {
    var cardBackNode = htmlUtils.addDiv(parent, [
      "player-" + index,
      "card",
      "back",
      "scoring",
    ]);

    var textNode = htmlUtils.addDiv(
      cardBackNode,
      ["text"],
      "scoring-text",
      "Score",
    );

    var symbolNode = htmlUtils.addImage(
      cardBackNode,
      ["player-icon-" + index, "scoring-symbol"],
      "scoring-symbol",
    );

    return cardBackNode;
  }

  return {
    addCardFront: addCardFront,
    addCardBack: addCardBack,
  };
});
