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

    gCardConfigs.push({
      count: 2,
      text: "Score all neighborhoods.",
    });
    gCardConfigs.push({
      count: 2,
      text: "Score all neighborhoods of any 2 <b>types</b>.",
    });
    gCardConfigs.push({
      count: 2,
      text: "Score all neighborhoods of any of any 1 <b>type</b>.",
    });
    gCardConfigs.push({
      count: 2,
      text: "Score any 1 neighborhood of 4 or more sectors.",
    });
    gCardConfigs.push({
      count: 2,
      text: "Score any 3 neighborhoods of 2 or fewer sectors.",
    });
    gCardConfigs.push({
      count: 2,
      text: "Score up to 3 neighborhoods where more than one player is dominant.",
    });

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
