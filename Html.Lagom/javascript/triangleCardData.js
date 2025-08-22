define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericUtils",
  "javascript/lagomCardUtils",
  "javascript/lagomCardDataUtils",
  "dojo/domReady!",
], function (
  cards,
  debugLog,
  genericUtils,
  lagomCardUtils,
  lagomCardDataUtils
) {
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

  // All cards have 4 symbols.
  var gNumSymbolsPerCard = 4;
  // Triangle sectors are indexed like so:
  //                 0
  //                 2
  //               1    3

  function generateOneZeroNoThreeArrays() {
    const results = new Set();

    function backtrack(arr, sum, zeros) {
      if (arr.length === 4) {
        if (sum === 4 && zeros === 1) {
          results.add(JSON.stringify(arr));
        }
        return;
      }

      for (let val = 0; val <= 2; val++) {
        backtrack([...arr, val], sum + val, zeros + (val === 0 ? 1 : 0));
      }
    }

    backtrack([], 0, 0);

    return Array.from(results).map((s) => JSON.parse(s));
  }

  const gOneZeroNoThreeArrays = generateOneZeroNoThreeArrays();

  console.log(
    "gOneZeroNoThreeArrays = " + JSON.stringify(gOneZeroNoThreeArrays)
  );

  // we want various permutations.
  function generateAllOneArrays(numArrays) {
    var allOneArrays = [];
    // Half have no blanks.
    for (var i = 0; i < numArrays; i++) {
      allOneArrays.push([1, 1, 1, 1]);
    }
    return allOneArrays;
  }

  var gAllOnesArrays = generateAllOneArrays(gOneZeroNoThreeArrays.length);

  var gSymbolCountBySectorIndexArray = [
    ...gOneZeroNoThreeArrays,
    ...gAllOnesArrays,
  ];

  console.log(
    "gSymbolCountBySectorIndexArray = " +
      JSON.stringify(gSymbolCountBySectorIndexArray)
  );

  // For each symbolCountBySectorIndex, how many instances of that layout do we have?
  // We are aiming for a 60-70is deck. 72?
  const gNumInstancesPerLayout = 3;
  const gTotalCardsInDeck =
    gNumInstancesPerLayout * gSymbolCountBySectorIndexArray.length;

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

  gMaxPurpose = 6;
  // This should slice up evenly so all purpose numbers have same likelihood of showing up.
  // There are gNumInstancesEachSymbol purpose symbols in the deck.
  const gInstancesEachPurposeNumber = gNumInstancesEachSymbol / gMaxPurpose;
  console.assert(
    gInstancesEachPurposeNumber == Math.floor(gInstancesEachPurposeNumber),
    "gInstancesEachPurposeNumber is not an int"
  );

  var purposeNumbers = [];
  for (var i = 0; i < gMaxPurpose; i++) {
    purposeNumbers.push(i + 1);
  }

  // Many times we try to get a card that doesn't have too many of one symbol.
  var gMaxTryCount = 10;

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
      var layoutIndex = Math.floor(cardIndex / gNumInstancesPerLayout);
      var gSymbolCountBySectorIndex =
        gSymbolCountBySectorIndexArray[layoutIndex];

      // Try this N times until we get a card with a nice distribution of symbols.
      var tryCount = 0;
      var cardConfig;
      while (true) {
        // Make a copy which is different.
        var copyOfShuffledArrayOfSymbols = genericUtils.copyAndShuffleArray(
          shuffledArrayOfSymbols,
          seededZeroToOneRandomFunction
        );
        var copyOfShuffledArrayOfPurposeNumbers =
          genericUtils.copyAndShuffleArray(
            shuffledArrayOfPurposeNumbers,
            seededZeroToOneRandomFunction
          );

        // Use the originals to make the call.
        var symbolsRequiringNumbers = {
          [symbolTypes.Purpose]: shuffledArrayOfPurposeNumbers,
        };

        cardConfig = lagomCardDataUtils.makeCardConfig(
          shuffledArrayOfSymbols,
          gSymbolCountBySectorIndex,
          gNumSymbolsPerCard,
          symbolsRequiringNumbers
        );
        tryCount++;

        // If good, bail.
        if (lagomCardUtils.cardHasNiceSymbolBalance(cardConfig)) {
          break;
        }
        // Too many tries: assert and bail.
        if (tryCount >= gMaxTryCount) {
          console.assert(
            false,
            "Failed to generate a good card after " + gMaxTryCount + " tries."
          );
          break;
        }
        // Try again.
        shuffledArrayOfSymbols = copyOfShuffledArrayOfSymbols;
        shuffledArrayOfPurposeNumbers = copyOfShuffledArrayOfPurposeNumbers;
      }

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
