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
  const ResourceType_AddAccomplishment = "wc-accomplishment";

  const ResourceType_LoseHealth = "wc-lose-health";
  const ResourceType_LoseWealth = "wc-lose-wealth";
  const ResourceType_LoseRelationships = "wc-lose-relationships";

  const resourceTypes = {
    AddRelationships: ResourceType_AddRelationships,
    AddWealth: ResourceType_AddWealth,
    AddPurpose: ResourceType_AddPurpose,
    AddLeisure: ResourceType_AddLeisure,
    AddAccomplishment: ResourceType_AddAccomplishment,

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
    resourceTypes.AddRelationships,
    resourceTypes.AddAccomplishment,
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

  var _symbolsPerQuad = [1, 1, 2, 3];
  var _numSymbolsPerCard = 0;
  for (var i = 0; i < _symbolsPerQuad.length; i++) {
    _numSymbolsPerCard += _symbolsPerQuad[i];
  }

  var _numGroups = 5;
  var _numCardsPerGroup = 12;
  var _totalNumCards = _numGroups * _numCardsPerGroup;
  var _totalSymbolsPerGroup = _numCardsPerGroup * _numSymbolsPerCard;
  var _totalSymbolsOfOneTypePerGroup =
    _totalSymbolsPerGroup / resourceTypesAdd.length;
  // Should divide evenly.
  console.assert(
    _totalSymbolsOfOneTypePerGroup ==
      Math.floor(_totalSymbolsOfOneTypePerGroup),
    "Total symbols of one type per group should divide evenly."
  );

  //-----------------------------------
  //
  // Global functions
  //
  //-----------------------------------
  function makeMapsForASingleCard(shuffledArrayOfSymbols, countPerQuad) {
    var sumFromCountPerQuad = 0;
    for (var i = 0; i < countPerQuad.length; i++) {
      sumFromCountPerQuad += countPerQuad[i];
    }
    console.assert(
      sumFromCountPerQuad == _numSymbolsPerCard,
      "makeMapsForASingleCard: sumFromCountPerQuad = " +
        sumFromCountPerQuad +
        " _numSymbolsPerCard = " +
        _numSymbolsPerCard
    );
    console.assert(
      shuffledArrayOfSymbols.length >= _numSymbolsPerCard,
      "makeMapsForASingleCard: shuffledArrayOfSymbols.length:" +
        shuffledArrayOfSymbols.length +
        " < _numSymbolsPerCard:" +
        _numSymbolsPerCard
    );

    var maps = [];
    for (var i = 0; i < countPerQuad.length; i++) {
      var map = {};
      for (var j = 0; j < countPerQuad[i]; j++) {
        var symbolType = shuffledArrayOfSymbols.shift();
        if (!map[symbolType]) {
          map[symbolType] = 0;
        }
        map[symbolType]++;
      }
      maps.push(map);
    }
    return maps;
  }

  function _generateCardConfigsInternal() {
    var rawSymbolArray = [];
    for (var cardIndex = 0; cardIndex < resourceTypesAdd.length; cardIndex++) {
      var symbolType = resourceTypesAdd[cardIndex];
      for (
        var symbolCount = 0;
        symbolCount < _totalSymbolsOfOneTypePerGroup;
        symbolCount++
      ) {
        rawSymbolArray.push(symbolType);
      }
    }
    debugLog.debugLog(
      "CardConfigs",
      "rawSymbolArray = " + JSON.stringify(rawSymbolArray)
    );

    // Make an array of purpose numbers:
    var rawPurposeNumberArray = [];
    for (
      var symbolIndex = 0;
      symbolIndex < _totalSymbolsOfOneTypePerGroup;
      symbolIndex++
    ) {
      var purposeNumber = symbolIndex % _numSymbolsPerCard;
      rawPurposeNumberArray.push(purposeNumber + 1);
    }
    debugLog.debugLog(
      "CardConfigs",
      "rawPurposeNumberArray = " + JSON.stringify(rawPurposeNumberArray)
    );

    var lecc = [];

    for (var groupIndex = 0; groupIndex < _numGroups; groupIndex++) {
      debugLog.debugLog(
        "CardConfigs",
        "Doug: generateLowEndCardConfigs groupIndex = " + groupIndex
      );

      // Shuffle symbols and purpose numbers.
      var shuffledArrayOfSymbols = genericUtils.copyAndShuffleArray(
        rawSymbolArray,
        seededZeroToOneRandomFunction
      );
      var shuffledArrayOfPurposeNumbers = genericUtils.copyAndShuffleArray(
        rawPurposeNumberArray,
        seededZeroToOneRandomFunction
      );

      debugLog.debugLog(
        "CardConfigs",
        "Doug: shuffledArrayOfSymbols = " +
          JSON.stringify(shuffledArrayOfSymbols)
      );
      debugLog.debugLog(
        "CardConfigs",
        "Doug: shuffledArrayOfSymbols.length = " +
          JSON.stringify(shuffledArrayOfSymbols.length)
      );
      debugLog.debugLog(
        "CardConfigs",
        "Doug: shuffledArrayOfPurposeNumbers = " +
          JSON.stringify(shuffledArrayOfPurposeNumbers)
      );
      debugLog.debugLog(
        "CardConfigs",
        "Doug: shuffledArrayOfPurposeNumbers.length = " +
          JSON.stringify(shuffledArrayOfPurposeNumbers.length)
      );

      // For purpose: we have _totalSymbolsOfOneTypePerGroup

      // Now make cards.
      for (var cardIndex = 0; cardIndex < _numCardsPerGroup; cardIndex++) {
        var maps = makeMapsForASingleCard(shuffledArrayOfSymbols, [1, 1, 2, 3]);
        debugLog.debugLog(
          "CardConfigs",
          "Doug: maps = " + JSON.stringify(maps)
        );
        var cardConfig = {};
        var quadDescs = [];
        for (var quadIndex = 0; quadIndex < maps.length; quadIndex++) {
          var quadDesc = {
            quadIndex: quadIndex,
            resourceTypeToResourceCountMap: maps[quadIndex],
          };

          // Did this quad have purpose?
          var numPurpose =
            quadDesc.resourceTypeToResourceCountMap[resourceTypes.AddPurpose];
          numPurpose = numPurpose ? numPurpose : 0;
          if (numPurpose > 0) {
            var purposeNumbers = [];
            for (
              var purposeIndex = 0;
              purposeIndex < numPurpose;
              purposeIndex++
            ) {
              var purposeNumber = shuffledArrayOfPurposeNumbers.shift();
              purposeNumbers.push(purposeNumber);
            }
            quadDesc.purposeNumbers = purposeNumbers;
          }
          quadDescs.push(quadDesc);
        }
        cardConfig.quadDescs = quadDescs;
        lecc.push(cardConfig);
      } // One card.
    } // One group.

    return lecc;
  }

  function getCardConfigAtIndex(index) {
    return cards.getCardConfigAtIndex(_cardConfigs, index);
  }

  function generateCardConfigs() {
    debugLog.debugLog("CardConfigs", "Doug: calling generateLowEndCardConfigs");

    _cardConfigs = _generateCardConfigsInternal();
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
