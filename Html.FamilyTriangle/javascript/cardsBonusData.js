define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "dojo/domReady!",
], function (cards, debugLogModule) {
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
      count: 6,
      title: "Contentment",
      text: "+3 VP at end of game.",
    });
    gCardConfigs.push({
      count: 3,
      title: "Rezoning",
      text: "Place a tile with all sectors overlapping existing sectors.",
    });
    gCardConfigs.push({
      count: 3,
      title: "Expansion",
      text: "Place a tile with no sectors overlapping existing sectors (<i>still must be adjacent to existing tiles</i>).",
    });
    gCardConfigs.push({
      count: 3,
      title: "Slush Fund",
      text: "Play before a bid: Add $2 to Pot.",
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
