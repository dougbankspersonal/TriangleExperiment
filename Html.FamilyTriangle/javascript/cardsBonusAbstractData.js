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
      count: 4,
      title: "Contentment",
      text: "<i>Secret until game end:</i><br> +1 VP of any type.",
    });
    gCardConfigs.push({
      count: 2,
      title: "Rezoning",
      text: "<i>Play when placing a tile:</i><br>Place tile with all sectors overlapping existing sectors.",
    });
    gCardConfigs.push({
      count: 2,
      title: "Expansion",
      text: "<i>Play when placing a tile:</i><br>Place tile with no sectors overlapping existing sectors (<i>still must be adjacent to existing tiles</i>).",
    });
    gCardConfigs.push({
      count: 1,
      title: "Swamp Expansion",
      text: "<i>Play when placing a tile:</i><br>First play the all-swamp tile, then place your tile.",
    });
    gCardConfigs.push({
      count: 1,
      title: "Swamp Pop-Up",
      text: "<i>Play when determining neighborhoods for scoring:</i><br>Pick any one Swamp region: treat it as any of the other 3 sector types.",
    });
    gCardConfigs.push({
      count: 2,
      title: "Aggressive Scheduling",
      text: "<i>Play when placing a tile:</i><br>Draw 2 extra tiles (so you have 3).  Play any one, shuffle the other two back into the deck.",
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
