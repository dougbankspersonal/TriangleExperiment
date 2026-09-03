define([
  "dojo/dom-style",
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/htmlUtils",
  "sharedJavascript/screentop/seatColors",
  "javascript/gameInfo",
  "javascript/cardsScoringData",
  "dojo/domReady!",
], function (
  domStyle,
  cards,
  debugLogModule,
  htmlUtils,
  seatColors,
  gameInfo,
  cardsScoringData,
) {
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

    var colorFamily = seatColors.getLightColorFamilyForSeat(
      cardConfig.playerIndex,
    );

    debugLog(
      "addCardFront",
      "Color family for player " + cardConfig.playerIndex + ": ",
      colorFamily,
    );

    domStyle.set(cardFrontNode, {
      "border-color": colorFamily.border,
      background:
        "linear-gradient(to bottom, " +
        "#ffffff" +
        " 0%, " +
        colorFamily.gradient2 +
        " 100%)",
    });

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

    var colorFamily = seatColors.getLightColorFamilyForSeat(index);

    debugLog(
      "addCardFront",
      "Color family for player " + index + ": ",
      colorFamily,
    );

    domStyle.set(cardBackNode, {
      "border-color": colorFamily.border,
    });

    return cardBackNode;
  }

  return {
    addCardFront: addCardFront,
    addCardBack: addCardBack,
  };
});
