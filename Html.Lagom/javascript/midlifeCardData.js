define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericUtils",
  "javascript/lagomConstants",
  "dojo/domReady!",
], function (cards, debugLogModule, genericUtils, lagomConstants) {
  var debugLog = debugLogModule.debugLog;

  //-----------------------------------
  //
  // Constants
  //
  //-----------------------------------
  var gCardConfigs = [];

  var gGoodOptionsMap = {
    g_energyIncomeUp: {
      types: ["Collection"],
      text: "Collect +1 Energy at the start of each turn.",
      title: "Sprightly",
    },
    g_relationshipScore: {
      types: ["Relationship"],
      text: "Collect +1 Fulfillment when scoring a Relationship.",
      title: "Extrovert",
    },
    g_achievementScore: {
      types: ["Achievement"],
      text: "Collect +1 Fulfillment on for every Achievement.",
      title: "Performer",
    },
    g_drawing: {
      types: ["Drawing"],
      text: "When drawing cards, draw 2, keep one, and shuffle one back into the deck.",
      title: "Resourceful",
    },
    g_relationshipGrowth: {
      types: ["Relationship"],
      text: "You may place 2 Energy on one Relationship each turn.",
      title: "Devoted",
    },
    g_investmentClosing: {
      types: ["Investment"],
      text: "Collect 4 Energy when closing an Investment.",
      title: "Market Savvy",
    },
    g_energyFinal: {
      types: ["EnergyScoring"],
      text: "At Final Scoring, score 1 Fulfillment for every 3 Energy (rounding up).",
      title: "Benefactor",
    },
    purposeFinal: {
      types: ["Purpose"],
      text: "At Final Scoring, score 1 Fulfillment for each odd-numbered Purpose.",
      title: "Explorer",
    },
    g_burning: {
      types: ["Burning"],
      text: "+2 Energy when buring a card.",
      title: "Intense",
    },
  };

  var gBadOptionsMap = {
    b_energyIncomeDown: {
      types: ["Collection"],
      text: "Collect -1 Energy at the start of each turn.",
      title: "Fading",
    },
    b_relationshipLoss: {
      types: ["Relationship"],
      text: "Immediately remove 2 Energy from all Relationships.",
      title: "Alienated",
    },
    b_relationshipScoring: {
      types: ["Relationship"],
      text: "Collect -1 Fulfillment when scoring a Relationship.",
      title: "Discontented",
    },
    b_investmentClosing: {
      types: ["Investment"],
      text: "Collect -1 Energy when closing an Investment",
      title: "Cautious",
    },
    b_purposeLoss: {
      types: ["Purpose"],
      text: "At Final Scoring, score -1 Fulfillment for each even-numbered Purpose.",
      title: "Remorseful",
    },
    purposeDuplicates: {
      types: ["Purpose"],
      text: "At Final Scoring, score -1 Fulfillment for each Purpose number which is duplicated.",
      title: "Dilettante",
    },
    b_finalRelationships: {
      types: ["Relationship"],
      text: "At Final Scoring, -1 for each Relationship symbol showing.",
      title: "Unresolved",
    },
    b_finalInvestments: {
      types: ["Investment"],
      text: "At Final Scoring, -1 for each Investment symbol showing.",
      title: "Penny-wise",
    },
    b_finalAchievements: {
      types: ["Achievement"],
      text: "At Final Scoring, -1 for every 2 Achievements (rounding up).",
      title: "Disillusioned",
    },
  };
  console.assert(
    gGoodOptionsMap.length == gBadOptionsMap.length,
    "Good and bad options should have the same length."
  );

  const gGoodOptionsKeys = Object.keys(gGoodOptionsMap);
  const gBadOptionsKeys = Object.keys(gBadOptionsMap);

  var gAllOptionsMap = {};

  // Each card has n good n bad.
  const gGoodOptionsPerCard = 2;
  const gBadOptionsPerCard = 2;
  // Each good/bad option is used n times.
  const gGoodOptionInstanceCount = 4;
  const gBadOptionInstanceCount = 4;

  // Do the math, how many cards total.
  const gTotalOptionsInDeck =
    Object.keys(gGoodOptionsMap).length * gGoodOptionInstanceCount +
    Object.keys(gBadOptionsMap).length * gBadOptionInstanceCount;

  const gTotalCardsInDeck =
    gTotalOptionsInDeck / (gGoodOptionsPerCard + gBadOptionsPerCard);

  var gMaxCardGenerationAttempts = 20;

  var gBadOptionsKeysHistory = {};
  var gGoodOptionsKeysHistory = {};

  //-----------------------------------
  //
  // Global functions
  //
  //-----------------------------------
  // True iff the options at given keys have any types in common.
  function typesForOptionKeysIntersect(optionKey1, optionKey2) {
    debugLog("midlifeCardData", "optionKey1 = " + optionKey1);
    debugLog("midlifeCardData", "optionKey2 = " + optionKey2);
    debugLog(
      "midlifeCardData",
      "gAllOptionsMap = " + JSON.stringify(gAllOptionsMap)
    );

    var option1 = gAllOptionsMap[optionKey1];
    var option2 = gAllOptionsMap[optionKey2];
    var types1 = option1.types || [];
    var types2 = option2.types || [];
    debugLog("midlifeCardData", "types1 = " + JSON.stringify(types1));
    debugLog("midlifeCardData", "types2 = " + JSON.stringify(types2));
    return types1.some((type) => types2.includes(type));
  }

  // This option key should not have been used yet and should have
  // diverget types from any used key.
  function optionValidationCallback(newOptionKey, usedOptionKeys) {
    for (var i = 0; i < usedOptionKeys.length; i++) {
      // No matches.
      var previousOptionKey = usedOptionKeys[i];
      if (previousOptionKey === newOptionKey) {
        return false;
      }
      // No intersecting types.
      if (typesForOptionKeysIntersect(previousOptionKey, newOptionKey)) {
        return false;
      }
    }
    return true;
  }

  function isValidCardConfig(cardConfig) {
    // Option keys should all be different.
    var optionKeysInConfig = cardConfig.goodOptionKeys.concat(
      cardConfig.badOptionKeys
    );
    var optionKeysSet = new Set(optionKeysInConfig);
    if (optionKeysSet.size !== optionKeysInConfig.length) {
      return false;
    }

    // Options should all have no types in common.
    for (var i = 0; i < optionKeysInConfig.length; i++) {
      var ithOptionKey = optionKeysInConfig[i];
      for (var j = i + 1; j < optionKeysInConfig.length; j++) {
        var jthOptionKey = optionKeysInConfig[j];
        if (typesForOptionKeysIntersect(ithOptionKey, jthOptionKey)) {
          return false;
        }
      }
    }
    return true;
  }

  function generateNthCardConfig() {
    var optionsThisCard = [];
    var goodOptionsThisCard = [];

    for (var i = 0; i < gGoodOptionsPerCard; i++) {
      var goodOption = genericUtils.getRandomFromArrayWithRails(
        gGoodOptionsKeys,
        gBadOptionsKeysHistory,
        gGoodOptionsKeys.length / 2,
        gGoodOptionInstanceCount,
        lagomConstants.getRandomZeroToOne,
        function (option) {
          return optionValidationCallback(option, optionsThisCard);
        }
      );
      goodOptionsThisCard.push(goodOption);
    }
    var badOptionsThisCard = [];
    for (var i = 0; i < gBadOptionsPerCard; i++) {
      var badOption = genericUtils.getRandomFromArrayWithRails(
        gBadOptionsKeys,
        gBadOptionsKeysHistory,
        gBadOptionsKeys.length / 2,
        gBadOptionInstanceCount,
        lagomConstants.getRandomZeroToOne,
        function (option) {
          return optionValidationCallback(option, optionsThisCard);
        }
      );
      badOptionsThisCard.push(badOption);
    }

    var cardConfig = {
      goodOptionKeys: goodOptionsThisCard,
      badOptionKeys: badOptionsThisCard,
    };

    // The rails call may fail and return something not-on-rails (may be impossible to
    // satisfy the conditions)
    // Check again
    if (isValidCardConfig(cardConfig)) {
      debugLog(
        "midlifeCardData",
        "generateNthCardConfig: returning cardConfig = ",
        JSON.stringify(cardConfig)
      );
      return cardConfig;
    }

    debugLog("midlifeCardData", "generateNthCardConfig: returning null");
    return null;
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function generateCardConfigsInternal() {
    debugLog("midlifeCardData", "generateCardConfigsInternal");
    debugLog(
      "midlifeCardData",
      "generateCardConfigsInternal: gTotalCardsInDeck = " + gTotalCardsInDeck
    );
    var cardConfigsAccumulator = [];

    for (var cardIndex = 0; cardIndex < gTotalCardsInDeck; cardIndex++) {
      debugLog(
        "midlifeCardData",
        "generateCardConfigsInternal cardIndex = " + cardIndex
      );

      var tryCount = 0;
      while (true) {
        var cardConfig = generateNthCardConfig();
        // May fail.
        if (cardConfig) {
          cardConfigsAccumulator.push(cardConfig);
          break;
        }
        if (tryCount > gMaxCardGenerationAttempts) {
          console.assert(
            false,
            "generateCardConfigsInternal: Max attempts reached"
          );
          // Just don't push anything this time.
          break;
        }
        tryCount++;
      }
    }
    debugLog(
      "midlifeCardData",
      "generateCardConfigsInternal: cardConfigsAccumulator = " +
        JSON.stringify(cardConfigsAccumulator)
    );
    debugLog(
      "midlifeCardData",
      "generateCardConfigsInternal: cardConfigsAccumulator.length = " +
        cardConfigsAccumulator.length
    );
    return cardConfigsAccumulator;
  }

  //-----------------------------------
  //
  // Functions
  //
  //-----------------------------------
  function getCardConfigAtIndex(index) {
    return cards.getCardConfigAtIndex(gCardConfigs, index);
  }

  function generateCardConfigs() {
    debugLog("midlifeCardData", "calling generateCardConfigs");
    debugLog(
      "midlifeCardData",
      "gGoodOptionsKeys = " + JSON.stringify(gGoodOptionsKeys)
    );
    debugLog(
      "midlifeCardData",
      "gBadOptionsKeys = " + JSON.stringify(gBadOptionsKeys)
    );
    for (var i = 0; i < gGoodOptionsKeys.length; i++) {
      gAllOptionsMap[gGoodOptionsKeys[i]] =
        gGoodOptionsMap[gGoodOptionsKeys[i]];
    }
    for (var i = 0; i < gBadOptionsKeys.length; i++) {
      gAllOptionsMap[gBadOptionsKeys[i]] = gBadOptionsMap[gBadOptionsKeys[i]];
    }

    debugLog(
      "midlifeCardData",
      "gAllOptionsMap = " + JSON.stringify(gAllOptionsMap)
    );

    debugLog("midlifeCardData", "gTotalOptionsInDeck = " + gTotalOptionsInDeck);
    debugLog("midlifeCardData", "gTotalCardsInDeck = " + gTotalCardsInDeck);

    gCardConfigs = generateCardConfigsInternal();
    debugLog(
      "midlifeCardData",
      "gCardConfigs = " + JSON.stringify(gCardConfigs)
    );
  }

  function getNumCards() {
    debugLog(
      "midlifeCardData",
      "getNumCards: gCardConfigs = " + JSON.stringify(gCardConfigs)
    );
    return cards.getNumCardsFromConfigs(gCardConfigs);
  }

  // This returned object becomes the defined value of this module
  return {
    allOptionsMap: gAllOptionsMap,

    getNumCards: getNumCards,
    getCardConfigAtIndex: getCardConfigAtIndex,
    generateCardConfigs: generateCardConfigs,
  };
});
