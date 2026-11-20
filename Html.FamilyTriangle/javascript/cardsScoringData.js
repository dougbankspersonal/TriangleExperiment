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
      text: "Select an Ocean region: score all regions adjacent to that region.",
    });
    gCardConfigs.push({
      text: "Score all regions of any of any 1 terrain type.",
    });
    gCardConfigs.push({
      text: "Score any 1 region of 4 or more sectors.",
    });
    gCardConfigs.push({
      text: "Score any 4 regions of 2 or fewer sectors.",
    });
    gCardConfigs.push({
      text: "Score up to 3 regions where more than one player is Leading.",
    });
    gCardConfigs.push({
      text: "Score all regions of 3 sectors.",
    });
    gCardConfigs.push({
      text: "Score the 2 largest regions: (in case of ties, active player selects which to score).",
    });
    gCardConfigs.push({
      text: "Score any 3 non-adjacent regions.",
    });
    gCardConfigs.push({
      text: "Score any 3 adjacent regions.",
    });
    gCardConfigs.push({
      text: "Select any non-Ocean region. Score all adjacent regions.",
    });
    gCardConfigs.push({
      text: "Score any 3 regions where a player is Leading by exactly one symbol.",
    });
    gCardConfigs.push({
      text: "Score any 2 regions with exactly one adjacent neighboring region (may be a different neighbor).",
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

    debugLog("getNumCards: gCardConfigs.length = ", gCardConfigs.length);
    return cards.getNumCardsFromConfigs(gCardConfigs);
  }

  // This returned object becomes the defined value of this module
  return {
    getNumCards: getNumCards,
    getCardConfigs: getCardConfigs,
  };
});
