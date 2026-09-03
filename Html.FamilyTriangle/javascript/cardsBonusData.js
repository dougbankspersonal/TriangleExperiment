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
      count: 1,
      title: "Rezoning",
      text: "Place a tile with all sectors overlapping existing sectors.",
    });
    gCardConfigs.push({
      count: 1,
      title: "Expansion",
      text: "Place a tile with no sectors overlapping existing sectors (<i>still must be adjacent to existing tiles</i>).",
    });
    gCardConfigs.push({
      count: 1,
      title: "Suppression",
      text: "Covered symbols do not generate tokens this turn.",
    });
    gCardConfigs.push({
      count: 1,
      title: "Swamp Pop-up",
      text: "<span class=mini>For one <b>Referendum</b>, when determiniming neighborhoods to assign votes, consider any <i>one</i> <b>Swamp</b> sector as any other neighborhood type.</span>",
    });
    gCardConfigs.push({
      count: 1,
      title: "Helping Hand",
      text: "Instead of taking your normal turn, draw and place a tile from any opponent's deck.",
    });
    gCardConfigs.push({
      count: 1,
      title: "Flood",
      text: "Instead of taking a normal turn, you may play an <b>All-Swamp Tile</b>.",
    });
    gCardConfigs.push({
      count: 1,
      title: "Dirty Tricks",
      text: "Immediately score 2 points.",
    });
    gCardConfigs.push({
      count: 1,
      title: "Ballot Stuffing",
      text: "When tallying votes for a Referendum, take 3 extra votes: give one of the 3 to any other player.",
    });
    gCardConfigs.push({
      count: 1,
      title: "Deep pockets",
      text: "Draw 3 extra tiles to your hand. Do not draw new tiles until all of these are played.",
    });
    gCardConfigs.push({
      count: 1,
      title: "Final Push",
      text: "You may add a vote to a tied Vote tally for one Drafted Resolution.",
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
