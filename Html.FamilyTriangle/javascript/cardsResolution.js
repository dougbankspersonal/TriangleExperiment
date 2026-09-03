define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/htmlUtils",
  "javascript/cardsResolutionData",
  "javascript/gameInfo",
  "dojo/domReady!",
], function (cards, debugLogModule, htmlUtils, cardsResolutionData, gameInfo) {
  var debugLog = debugLogModule.debugLog;

  function addCardFront(parent, index) {
    var cardConfigs = cardsResolutionData.getCardConfigs();
    var cardConfig = cards.getCardConfigAtIndex(cardConfigs, index);
    var cardFrontNode = cards.addCardFront(
      parent,
      ["resolution"],
      "resolution",
    );

    var terrainCountNode = htmlUtils.addDiv(
      cardFrontNode,
      ["terrain-count"],
      "terrain-count",
    );
    if (cardConfig.terrainCount < gameInfo.scoringTerrainTypesArray.length) {
      for (var i = 0; i < cardConfig.terrainCount; i++) {
        htmlUtils.addImage(
          terrainCountNode,
          ["terrain-square", "empty-slot"],
          "terrain-square",
        );
      }
    } else {
      for (var i = 0; i < gameInfo.scoringTerrainTypesArray.length; i++) {
        var terrainSquareClass =
          "square-" + gameInfo.scoringTerrainTypesArray[i];
        htmlUtils.addImage(
          terrainCountNode,
          ["terrain-square", terrainSquareClass],
          "terrain-square",
        );
      }
    }

    var playerIconsNode = htmlUtils.addDiv(
      cardFrontNode,
      ["player-icons"],
      "player-icons",
    );

    for (const [playerIconClass, count] of Object.entries(
      cardConfig.playerIconCounts,
    )) {
      for (var i = 0; i < count; i++) {
        htmlUtils.addImage(
          playerIconsNode,
          ["player-icon", playerIconClass],
          "player-icon",
        );
      }
    }

    var textNode = htmlUtils.addDiv(
      cardFrontNode,
      ["text"],
      "resolution-text",
      cardConfig.text,
    );

    return cardFrontNode;
  }

  function addCardBack(parent, _) {
    var cardBackNode = htmlUtils.addDiv(parent, ["card", "back", "resolution"]);

    var textNode = htmlUtils.addDiv(
      cardBackNode,
      ["text"],
      "resolution-text",
      "Resolution",
    );

    return cardBackNode;
  }

  return {
    addCardFront: addCardFront,
    addCardBack: addCardBack,
  };
});
