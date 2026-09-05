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

  // Just a reminder:
  // 0: Clowns
  // 1: Veggies
  // 2: Cats
  // 3. Education

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
      text: "Subsidies to help clowns buy parsnips.",
    });
    gCardConfigs.push({
      terrainCount: 1,
      playerIconCounts: {
        "player-icon-0": 2,
        "player-icon-2": 1,
      },
      text: "Bi-weekly clown visits to cat shelters.",
    });
    gCardConfigs.push({
      terrainCount: 1,
      playerIconCounts: {
        "player-icon-0": 2,
        "player-icon-3": 1,
      },
      text: 'Eliminate tariffs on imports of "How to Clown".',
    });
    gCardConfigs.push({
      terrainCount: 1,
      playerIconCounts: {
        "player-icon-1": 2,
        "player-icon-0": 1,
      },
      text: '<b>"Clown Salad Appreciation Day."</b>',
    });
    gCardConfigs.push({
      terrainCount: 1,
      playerIconCounts: {
        "player-icon-1": 2,
        "player-icon-2": 1,
      },
      text: "Fund research on celery's contribution to kitty litter.",
    });
    gCardConfigs.push({
      terrainCount: 1,
      playerIconCounts: {
        "player-icon-1": 2,
        "player-icon-3": 1,
      },
      text: "Introduce Artichokes-for-A's program in local elementary schools.",
    });
    gCardConfigs.push({
      terrainCount: 1,
      playerIconCounts: {
        "player-icon-2": 2,
        "player-icon-0": 1,
      },
      text: "Cats wearing clown wigs may run for local offices.",
    });
    gCardConfigs.push({
      terrainCount: 1,
      playerIconCounts: {
        "player-icon-2": 2,
        "player-icon-1": 1,
      },
      text: "Crack down on illegal kitten/potato cage matches.",
    });
    gCardConfigs.push({
      terrainCount: 1,
      playerIconCounts: {
        "player-icon-2": 2,
        "player-icon-3": 1,
      },
      text: "Every classroom must have 3 books highlighting the feline lifestyle.",
    });
    gCardConfigs.push({
      terrainCount: 1,
      playerIconCounts: {
        "player-icon-3": 2,
        "player-icon-0": 1,
      },
      text: "Clowns may be hired as substitute teachers.",
    });
    gCardConfigs.push({
      terrainCount: 1,
      playerIconCounts: {
        "player-icon-3": 2,
        "player-icon-1": 1,
      },
      text: "Qualified Jalapeno Peppers may enroll in the local junior college.",
    });
    gCardConfigs.push({
      terrainCount: 1,
      playerIconCounts: {
        "player-icon-3": 2,
        "player-icon-2": 1,
      },
      text: "Reduce taxes on school plays featuring cats in lead roles.",
    });

    // 2-terrain:
    gCardConfigs.push({
      terrainCount: 2,
      playerIconCounts: {
        "player-icon-0": 1,
        "player-icon-1": 1,
      },
      text: "Lift the ban on lettuce-affirming japery in clown acts.",
    });
    gCardConfigs.push({
      terrainCount: 2,
      playerIconCounts: {
        "player-icon-0": 1,
        "player-icon-2": 1,
      },
      text: "Children dressed as cat-clowns are entitled to double candy on Halloween.",
    });
    gCardConfigs.push({
      terrainCount: 2,
      playerIconCounts: {
        "player-icon-0": 1,
        "player-icon-3": 1,
      },
      text: "Widen the highway leading to Nicky's Clown College.",
    });
    gCardConfigs.push({
      terrainCount: 2,
      playerIconCounts: {
        "player-icon-1": 1,
        "player-icon-2": 1,
      },
      text: "Allow Helen Anderson to merge <b>Helen's Catfood Emporium</b> and <b>Helen's Spinach Boutique</b>.",
    });
    gCardConfigs.push({
      terrainCount: 2,
      playerIconCounts: {
        "player-icon-1": 1,
        "player-icon-3": 1,
      },
      text: "Expand vegetarian options for school lunches.",
    });
    gCardConfigs.push({
      terrainCount: 2,
      playerIconCounts: {
        "player-icon-2": 1,
        "player-icon-3": 1,
      },
      text: "Dedicate salmon surplus to local schools and cat shelters.",
    });

    // 3 terrain.
    gCardConfigs.push({
      terrainCount: 3,
      playerIconCounts: {
        "player-icon-0": 1,
      },
      text: "Relax seatbelt laws for Clown Cars.",
    });
    gCardConfigs.push({
      terrainCount: 3,
      playerIconCounts: {
        "player-icon-1": 1,
      },
      text: 'Coordinate a yearly <br><b>"Fun with Fennel Fair"</b>.',
    });
    gCardConfigs.push({
      terrainCount: 3,
      playerIconCounts: {
        "player-icon-2": 1,
      },
      text: "Ban on rocking chairs.",
    });
    gCardConfigs.push({
      terrainCount: 3,
      playerIconCounts: {
        "player-icon-3": 1,
      },
      text: "Certified teachers may share food at buffets.",
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
