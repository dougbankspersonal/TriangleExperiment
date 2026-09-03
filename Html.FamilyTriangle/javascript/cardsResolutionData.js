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

    // 1-terrain:
    gCardConfigs.push({
      terrainCount: 1,
      playerIconCounts: {
        "player-icon-0": 2,
        "player-icon-1": 1,
      },
      text: "Clowns may not serve kale to children.",
    });
    gCardConfigs.push({
      terrainCount: 1,
      playerIconCounts: {
        "player-icon-1": 2,
        "player-icon-2": 1,
      },
      text: "It is illegal to sell chard to kittens.",
    });
    gCardConfigs.push({
      terrainCount: 1,
      playerIconCounts: {
        "player-icon-2": 2,
        "player-icon-3": 1,
      },
      text: "Eliminate subsidies to teach French to housecats",
    });
    gCardConfigs.push({
      terrainCount: 1,
      playerIconCounts: {
        "player-icon-3": 2,
        "player-icon-0": 1,
      },
      text: "Remove all references to the Clowning Lifestyle from children's textbooks",
    });

    // 2-terrain:
    gCardConfigs.push({
      terrainCount: 2,
      playerIconCounts: {
        "player-icon-0": 1,
        "player-icon-1": 1,
      },
      text: "10% tax on carrots to fund anti-Clown initiatives.",
    });
    gCardConfigs.push({
      terrainCount: 2,
      playerIconCounts: {
        "player-icon-0": 1,
        "player-icon-2": 1,
      },
      text: "Cats may not dress as Clowns for Halloween.",
    });
    gCardConfigs.push({
      terrainCount: 2,
      playerIconCounts: {
        "player-icon-0": 1,
        "player-icon-3": 1,
      },
      text: "25% hike in City Clown College tuition.",
    });
    gCardConfigs.push({
      terrainCount: 2,
      playerIconCounts: {
        "player-icon-1": 1,
        "player-icon-2": 1,
      },
      text: "Catfood and leeks must be sold at different stores.",
    });
    gCardConfigs.push({
      terrainCount: 2,
      playerIconCounts: {
        "player-icon-1": 1,
        "player-icon-3": 1,
      },
      text: "Turnips need special permission to take higher math classes.",
    });
    gCardConfigs.push({
      terrainCount: 2,
      playerIconCounts: {
        "player-icon-2": 1,
        "player-icon-3": 1,
      },
      text: "30% emergency cat food supplies diverted to school lunches.",
    });

    // 3 terrain.
    gCardConfigs.push({
      terrainCount: 3,
      playerIconCounts: {
        "player-icon-0": 1,
      },
      text: "Max 3 clowns per car.",
    });
    gCardConfigs.push({
      terrainCount: 3,
      playerIconCounts: {
        "player-icon-1": 1,
      },
      text: "5% hike on brussels sprouts tariffs.",
    });
    gCardConfigs.push({
      terrainCount: 3,
      playerIconCounts: {
        "player-icon-2": 1,
      },
      text: "Catnip is a <b>Schedule 1</b> drug.",
    });
    gCardConfigs.push({
      terrainCount: 3,
      playerIconCounts: {
        "player-icon-3": 1,
      },
      text: "Hoboes may be hired as substitute teachers.",
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
