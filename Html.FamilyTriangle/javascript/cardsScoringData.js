define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "javascript/gameInfo",
  "dojo/domReady!",
], function (cards, debugLogModule, gameInfo) {
  var debugLog = debugLogModule.debugLog;
  //-----------------------------------
  //
  // Global state.
  //
  //-----------------------------------
  var gCardConfigs = null;

  function generateCardConfigs() {
    if (gCardConfigs !== null) {
      return gCardConfigs;
    }
    gCardConfigs = [];

    // One set for each player.
    for (var i = 0; i < gameInfo.numPlayers; i++) {
      gCardConfigs.push({
        playerIndex: i,
        text: "Score all regions",
      });
      gCardConfigs.push({
        playerIndex: i,
        text: "Score any two neighborhood <b>types</b>",
      });
      gCardConfigs.push({
        playerIndex: i,
        text: "Score up to 3 different regions",
      });
      gCardConfigs.push({
        playerIndex: i,
        text: "Score 1 region <b>type</b>, <b>twice</b>.",
      });
    }

    return gCardConfigs;
  }

  function getCardConfigs() {
    generateCardConfigs();

    console.assert(
      gCardConfigs,
      "getNumCards called before generateCardConfigs",
    );
    debugLog("getCardConfigs: gCardConfigs.length = ", gCardConfigs.length);
    return gCardConfigs;
  }

  function getNumCards() {
    generateCardConfigs();
    console.assert(
      gCardConfigs,
      "getNumCards called before generateCardConfigs",
    );
    return cards.getNumCardsFromConfigs(gCardConfigs);
  }

  // This returned object becomes the defined value of this module
  return {
    getNumCards: getNumCards,
    getCardConfigs: getCardConfigs,
  };
});
