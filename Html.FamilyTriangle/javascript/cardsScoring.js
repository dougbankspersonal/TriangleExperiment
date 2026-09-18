define([
  "dojo/dom-style",
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/htmlUtils",
  "sharedJavascript/screentop/seatColors",
  "javascript/gameInfo",
  "javascript/cardsScoringAbstractData",
  "dojo/domReady!",
], function (
  domStyle,
  cards,
  debugLogModule,
  htmlUtils,
  seatColors,
  gameInfo,
  cardsScoringAbstractData,
) {
  var debugLog = debugLogModule.debugLog;

  function addCardFront(parent, index) {
    var cardConfigs = cardsScoringAbstractData.getCardConfigs();
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
    var trophyNode = htmlUtils.addImage(cardBackNode, ["trophy"], "trophy");

    return cardBackNode;
  }

  return {
    addCardFront: addCardFront,
    addCardBack: addCardBack,
  };
});
