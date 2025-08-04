define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericUtils",
  "dojo/domReady!",
], function (cards, debugLog, genericUtils) {
  //-----------------------------------
  //
  // Constants
  //
  //-----------------------------------
  const QuadType_Add = "add";
  const QuadType_Lose = "lose";

  const quadTypes = {
    Add: QuadType_Add,
    Lose: QuadType_Lose,
  };

  const ResourceType_AddRelationships = "wc-relationships";
  const ResourceType_AddWealth = "wc-wealth";
  const ResourceType_AddPurpose = "wc-purpose";
  const ResourceType_AddLeisure = "wc-leisure";

  const ResourceType_LoseHealth = "wc-lose-health";
  const ResourceType_LoseWealth = "wc-lose-wealth";
  const ResourceType_LoseRelationships = "wc-lose-relationships";

  const NormalSpend = 4;

  // 12 low-end cards.
  var numMidRangeCards = 36;
  var numHighEndCards = 12;

  const resourceTypes = {
    AddRelationships: ResourceType_AddRelationships,
    AddWealth: ResourceType_AddWealth,
    AddPurpose: ResourceType_AddPurpose,
    AddLeisure: ResourceType_AddLeisure,

    LoseHealth: ResourceType_LoseHealth,
    LoseWealth: ResourceType_LoseWealth,
    LoseRelationships: ResourceType_LoseRelationships,
  };

  var loseToAddAnalogueMap = {
    [resourceTypes.LoseWealth]: resourceTypes.AddWealth,
    [resourceTypes.LoseRelationships]: resourceTypes.AddRelationships,
  };

  const resourceTypesAdd = [
    resourceTypes.AddWealth,
    resourceTypes.AddPurpose,
    resourceTypes.AddLeisure,
    resourceTypes.AddRelationships,
  ];

  const resourceTypesLose = [
    resourceTypes.LoseWealth,
    resourceTypes.LoseHealth,
    resourceTypes.LoseRelationships,
  ];

  const seededZeroToOneRandomFunction =
    genericUtils.createSeededGetZeroToOneRandomFunction(36593650);

  //-----------------------------------
  //
  // Global vars
  //
  //-----------------------------------
  var _cardConfigs = [];

  //-----------------------------------
  //
  // Global functions
  //
  //-----------------------------------
  function generateLowEndCardConfigs() {
    debugLog.debugLog("CardConfigs", "Doug: generateLowEndCardConfigs 001");
    var lecc = [];

    // They must be different.  So basically every possible non-matching pair, where
    // order does not matter.
    for (var i = 0; i < resourceTypesAdd.length - 1; i++) {
      debugLog.debugLog(
        "CardConfigs",
        "Doug: generateLowEndCardConfigs i = " + i
      );
      for (var j = i + 1; j < resourceTypesAdd.length; j++) {
        debugLog.debugLog(
          "CardConfigs",
          "Doug: generateLowEndCardConfigs j = " + j
        );
        var resourceType1 = resourceTypesAdd[i];
        debugLog.debugLog(
          "CardConfigs",
          "Doug: generateLowEndCardConfigs resourceType1 = " + resourceType1
        );
        var resourceType2 = resourceTypesAdd[j];
        debugLog.debugLog(
          "CardConfigs",
          "Doug: generateLowEndCardConfigs resourceType2 = " + resourceType2
        );
        var cardConfig = {
          count: 2,
          quadDescs: [
            {
              quadIndex: 0,
              resourceTypeToResourceCountMap: {
                [resourceType1]: 1,
              },
            },
            {
              quadIndex: 3,
              resourceTypeToResourceCountMap: {
                [resourceType2]: 1,
              },
            },
          ],
        };
        debugLog.debugLog(
          "CardConfigs",
          "Doug: generateLowEndCardConfigs cardConfig = " +
            JSON.stringify(cardConfig)
        );
        lecc.push(cardConfig);
      }
    }
    debugLog.debugLog(
      "CardConfigs",
      "Doug: generateLowEndCardConfigs lecc = " + JSON.stringify(lecc)
    );
    return lecc;
  }

  // Array of histograms.
  // Return a table mapping "any key used in the histograms" to true.
  function generateUsedKeysTable(histograms) {
    debugLog.debugLog(
      "CardConfigs",
      "Doug: generateUsedKeysTable histograms = " + JSON.stringify(histograms)
    );
    var usedKeys = {};
    for (var i = 0; i < histograms.length; i++) {
      var histogram = histograms[i];
      for (var key in histogram) {
        usedKeys[key] = true;
      }
    }
    return usedKeys;
  }

  function mapRawLoseKeysToAddAnalogue(loseKeys) {
    var mappedLoseKeys = [];
    for (var i = 0; i < loseKeys.length; i++) {
      var loseKey = loseKeys[i];
      var mappedLoseKey = loseToAddAnalogueMap[loseKey];
      if (mappedLoseKey) {
        mappedLoseKeys.push(mappedLoseKey);
      }
    }
    return mappedLoseKeys;
  }

  function getLoseHistogramsWithUniqueKeys(count, addHistograms) {
    // note all the keys used in addHistograms.
    var rawUsedKeysTableFromLose = generateUsedKeysTable(addHistograms);

    // Keep trying to generate a pair of lose histograms whose keys
    // involve something not in the add histograms.
    for (var z = 0; z < 1000; z++) {
      var nonMatchingLoseHistograms =
        genericUtils.generateNonMatchingHistograms(
          count,
          resourceTypesLose,
          seededZeroToOneRandomFunction
        );
      var rawUsedKeysTableFromLose = generateUsedKeysTable(
        nonMatchingLoseHistograms
      );
      var mappedUsedKeysTableFromLose = mapRawLoseKeysToAddAnalogue(
        rawUsedKeysTableFromLose
      );
      // Not same as add keys?  Winner.
      if (
        !genericUtils.tablesMatch(
          rawUsedKeysTableFromLose,
          mappedUsedKeysTableFromLose
        )
      ) {
        return nonMatchingLoseHistograms;
      }
    }
    console.assert(false, "Early exit from getLoseHistogramsWithUniqueKeys");
  }

  function generateCardConfigFamily(
    numCards,
    numAddResources,
    numLoseResources
  ) {
    var cardConfigs = [];
    for (var i = 0; i < numCards; i++) {
      debugLog.debugLog(
        "CardConfigs",
        "Doug: generateCardConfigFamily i = " + i
      );

      var nonMatchingAddHistograms;
      for (var z = 0; z < 1000; z++) {
        nonMatchingAddHistograms = genericUtils.generateNonMatchingHistograms(
          numAddResources,
          resourceTypesAdd,
          seededZeroToOneRandomFunction
        );

        // Reject anything offering more than one add leisure.
        var leisureCount1 = nonMatchingAddHistograms[0][
          resourceTypes.AddLeisure
        ]
          ? nonMatchingAddHistograms[0][resourceTypes.AddLeisure]
          : 0;
        var leisureCount2 = nonMatchingAddHistograms[1][
          resourceTypes.AddLeisure
        ]
          ? nonMatchingAddHistograms[1][resourceTypes.AddLeisure]
          : 0;
        if (leisureCount1 <= 1 && leisureCount2 <= 1) {
          break;
        }
      }

      // m "lose" options, different from each other.
      var nonMatchingLoseHistograms = getLoseHistogramsWithUniqueKeys(
        numLoseResources,
        nonMatchingAddHistograms
      );

      var cardConfig = {
        quadDescs: [
          {
            quadIndex: 0,
            resourceTypeToResourceCountMap: nonMatchingAddHistograms[0],
          },
          {
            quadIndex: 1,
            resourceTypeToResourceCountMap: nonMatchingLoseHistograms[0],
          },
          {
            quadIndex: 2,
            resourceTypeToResourceCountMap: nonMatchingLoseHistograms[1],
          },
          {
            quadIndex: 3,
            resourceTypeToResourceCountMap: nonMatchingAddHistograms[1],
          },
        ],
      };
      cardConfigs.push(cardConfig);
    }
    return cardConfigs;
  }

  function generateHighEndCardConfigs() {
    debugLog.debugLog("CardConfigs", "Doug: generateHighEndCardConfigs");
    var cardConfigs = generateCardConfigFamily(numHighEndCards, 3, 2);
    return cardConfigs;
  }

  function generateMidRangeCardConfigs() {
    debugLog.debugLog("CardConfigs", "Doug: generateMidRangeCardConfigs");
    var cardConfigs = generateCardConfigFamily(numMidRangeCards, 2, 1);
    return cardConfigs;
  }

  function getCardConfigAtIndex(index) {
    return cards.getCardConfigAtIndex(_cardConfigs, index);
  }

  function generateCardConfigs() {
    debugLog.debugLog("CardConfigs", "Doug: calling generateLowEndCardConfigs");
    var lowEndCardConfigs = generateLowEndCardConfigs();
    debugLog.debugLog(
      "CardConfigs",
      "Doug: called  generateLowEndCardConfigs: lowEndCardConfigs = " +
        JSON.stringify(lowEndCardConfigs)
    );
    var midRangeCardConfigs = generateMidRangeCardConfigs();
    debugLog.debugLog(
      "CardConfigs",
      "Doug: called  generateMidRangeCardConfigs: _midRangeCardConfigs = " +
        JSON.stringify(midRangeCardConfigs)
    );
    var highEndCardConfigs = generateHighEndCardConfigs();
    debugLog.debugLog(
      "CardConfigs",
      "Doug: called  generateHighEndCardConfigs: highEndCardConfigs = " +
        JSON.stringify(highEndCardConfigs)
    );
    _cardConfigs = lowEndCardConfigs
      .concat(midRangeCardConfigs)
      .concat(highEndCardConfigs);

    debugLog.debugLog(
      "CardConfigs",
      "getNumCards: _cardConfigs = " + JSON.stringify(_cardConfigs)
    );
    return _cardConfigs;
  }

  //-----------------------------------
  //
  // Functions
  //
  //-----------------------------------
  function getNumCards() {
    debugLog.debugLog(
      "CardConfigs",
      "getNumCards: _cardConfigs = " + JSON.stringify(_cardConfigs)
    );
    return cards.getNumCardsFromConfigs(_cardConfigs);
  }

  // This returned object becomes the defined value of this module
  return {
    resourceTypes: resourceTypes,
    quadTypes: quadTypes,
    resourceTypesAdd: resourceTypesAdd,
    resourceTypesLose: resourceTypesLose,

    getNumCards: getNumCards,
    getCardConfigAtIndex: getCardConfigAtIndex,
    generateCardConfigs: generateCardConfigs,
  };
});
