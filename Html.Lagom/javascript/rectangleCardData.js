define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericUtils",
  "javascript/lagomCardDataUtils",
  "dojo/domReady!",
], function (cards, debugLog, genericUtils, lagomCardDataUtils) {
  //-----------------------------------
  //
  // Constants
  //
  //-----------------------------------
  const SymbolType_Relationships = "wc-relationships";
  const SymbolType_Wealth = "wc-wealth";
  const SymbolType_Purpose = "wc-purpose";
  const SymbolType_Accomplishment = "wc-accomplishment";

  const symbolTypes = {
    Relationships: SymbolType_Relationships,
    Wealth: SymbolType_Wealth,
    Purpose: SymbolType_Purpose,
    Accomplishment: SymbolType_Accomplishment,
  };

  const symbolTypesArray = [
    symbolTypes.Relationships,
    symbolTypes.Wealth,
    symbolTypes.Purpose,
    symbolTypes.Accomplishment,
  ];

  const seededZeroToOneRandomFunction =
    genericUtils.createSeededGetZeroToOneRandomFunction(36593650);

  //-----------------------------------
  //
  // Global vars
  //
  //-----------------------------------
  var gCardConfigs = [];

  const gSymbolCountBySectorIndex = [0, 3, 2, 1];

  var gNumSymbolsPerCard = 0;
  for (var i = 0; i < gSymbolCountBySectorIndex.length; i++) {
    gNumSymbolsPerCard += gSymbolCountBySectorIndex[i];
  }

  const gTotalCardsInDeck = 60;
  const gTotalSymbolsInDeck = gTotalCardsInDeck * gNumSymbolsPerCard;
  const gNumInstancesEachSymbol = gTotalSymbolsInDeck / symbolTypesArray.length;

  // Should divide evenly: each symbol has equal likelihood of showing up.
  console.assert(
    gNumInstancesEachSymbol == Math.floor(gNumInstancesEachSymbol),
    "gNumInstancesEachSymbol is not an int: gNumInstancesEachSymbol = " +
      gNumInstancesEachSymbol +
      ": gTotalSymbolsInDeck = " +
      gTotalSymbolsInDeck +
      ": symbolTypesArray.length = " +
      symbolTypesArray.length
  );

  gMaxPurpose = 9;
  // This should slice up evenly so all purpose numbers have same likelihood of showing up.
  // There are gNumInstancesEachSymbol purpose symbols in the deck.
  const gInstancesEachPurposeNumber = gNumInstancesEachSymbol / gMaxPurpose;
  console.assert(
    gInstancesEachPurposeNumber == Math.floor(gInstancesEachPurposeNumber),
    "gInstancesEachPurposeNumber is not an int: gInstancesEachPurposeNumber = " +
      gInstancesEachPurposeNumber +
      ", gNumInstancesEachSymbol = " +
      gNumInstancesEachSymbol +
      ", gMaxPurpose = " +
      gMaxPurpose
  );

  var purposeNumbers = [];
  for (var i = 0; i < gMaxPurpose; i++) {
    purposeNumbers.push(i + 1);
  }

  //-----------------------------------
  //
  // Global functions
  //
  //-----------------------------------
  function generateCardConfigsInternal() {
    var rawSymbolArray = lagomCardDataUtils.generateNCountArray(
      symbolTypesArray,
      gNumInstancesEachSymbol
    );
    debugLog.debugLog(
      "CardConfig",
      "rawSymbolArray = " + JSON.stringify(rawSymbolArray)
    );

    // Make an array of purpose numbers:
    var rawPurposeNumberArray = lagomCardDataUtils.generateNCountArray(
      purposeNumbers,
      gInstancesEachPurposeNumber
    );
    debugLog.debugLog(
      "CardConfig",
      "rawPurposeNumberArray = " + JSON.stringify(rawPurposeNumberArray)
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

    var cardConfigsAccumulator = [];

    for (var cardIndex = 0; cardIndex < gTotalCardsInDeck; cardIndex++) {
      debugLog.debugLog(
        "CardConfigs",
        "generateCardConfigsInternal cardIndex = " + cardIndex
      );

      debugLog.debugLog(
        "CardConfigs",
        "shuffledArrayOfSymbols = " + JSON.stringify(shuffledArrayOfSymbols)
      );
      debugLog.debugLog(
        "CardConfigs",
        "shuffledArrayOfSymbols.length = " +
          JSON.stringify(shuffledArrayOfSymbols.length)
      );
      debugLog.debugLog(
        "CardConfigs",
        "shuffledArrayOfPurposeNumbers = " +
          JSON.stringify(shuffledArrayOfPurposeNumbers)
      );
      debugLog.debugLog(
        "CardConfigs",
        "shuffledArrayOfPurposeNumbers.length = " +
          JSON.stringify(shuffledArrayOfPurposeNumbers.length)
      );

      var symbolsRequiringNumbers = {
        [symbolTypes.Purpose]: shuffledArrayOfPurposeNumbers,
      };

      var cardConfig = lagomCardDataUtils.makeCardConfig(
        shuffledArrayOfSymbols,
        gSymbolCountBySectorIndex,
        gNumSymbolsPerCard,
        symbolsRequiringNumbers
      );

      cardConfigsAccumulator.push(cardConfig);
    } // One card.

    return cardConfigsAccumulator;
  }

  function getCardConfigAtIndex(index) {
    return cards.getCardConfigAtIndex(gCardConfigs, index);
  }

  function generateCardConfigs() {
    debugLog.debugLog("CardConfigs", "calling generateLowEndCardConfigs");

    gCardConfigs = generateCardConfigsInternal();
  }

  //-----------------------------------
  //
  // Functions
  //
  //-----------------------------------
  function getNumCards() {
    debugLog.debugLog(
      "CardConfigs",
      "getNumCards: _cardConfigs = " + JSON.stringify(gCardConfigs)
    );
    return cards.getNumCardsFromConfigs(gCardConfigs);
  }

  // This returned object becomes the defined value of this module
  return {
    symbolTypes: symbolTypes,
    symbolTypesArray: symbolTypesArray,

    getNumCards: getNumCards,
    getCardConfigAtIndex: getCardConfigAtIndex,
    generateCardConfigs: generateCardConfigs,
  };
});
