define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericUtils",
  "javascript/distributions",
  "javascript/lagomCardDataUtils",
  "dojo/domReady!",
], function (
  cards,
  debugLogModule,
  genericUtils,
  distributions,
  lagomCardDataUtils
) {
  var debugLog = debugLogModule.debugLog;

  //-----------------------------------
  //
  // Constants
  //
  //-----------------------------------
  var gCardConfigs = [];

  // Triangle sectors are indexed like so:
  //                 0
  //                 2
  //               1    3
  const gNumSectors = 4;
  const gMiddleSectorIndex = 2;

  const gTotalCardsInDeck = 80;

  // Things we frequently twiddle.
  // Keep them here in "configs", add/uncomment as needed.
  const sixSymbolConfig = {
    numSymbolsPerCard: 6,
    maxPurposeValue: 9,
    checks: [lagomCardDataUtils.noSymbolHasMajority],
  };
  const fiveSymbolConfig = {
    numSymbolsPerCard: 5,
    maxPurposeValue: 9,
    checks: [lagomCardDataUtils.noSymbolHasMajority],
  };
  const threeSymbolConfig = {
    numSymbolsPerCard: 3,
    maxPurposeValue: 4,
    checks: [
      lagomCardDataUtils.hasAtLeastTwoSymbolTypes,
      function (cardConfig) {
        return (
          0 ==
          lagomCardDataUtils.countSymbolsInSector(
            cardConfig,
            gMiddleSectorIndex
          )
        );
      },
    ],
  };

  // This is it. where we set confgs.
  const gCardConfig = threeSymbolConfig;

  const gNumSymbolsPerCard = gCardConfig.numSymbolsPerCard;
  const gMaxPurposeValue = gCardConfig.maxPurposeValue;
  const gChecks = gCardConfig.checks;

  console.assert(
    gMaxPurposeValue <= lagomCardDataUtils.numPurposeSprites,
    "gMaxPurposeValue is greater than numPurposeSprites"
  );

  // How many times we try to get a card that doesn't have too many of one symbol.
  const gMaxTriesToGenerateAValidRandomCardConfig = 20;

  const gValidDistributions = distributions.generateAllValidSymbolDistributions(
    gNumSectors,
    gNumSymbolsPerCard
  );

  // How many symbols in the whole deck?
  const gTotalSymbolsInDeck = gTotalCardsInDeck * gNumSymbolsPerCard;

  // Should divide evenly: each symbol has equal likelihood of showing up.
  console.assert(
    gTotalSymbolsInDeck % lagomCardDataUtils.numSymbols == 0,
    "gTotalSymbolsInDeck = " +
      gTotalSymbolsInDeck +
      ": lagomCardDataUtils.numSymbols = " +
      lagomCardDataUtils.numSymbols
  );
  const gNumInstancesEachSymbol =
    gTotalSymbolsInDeck / lagomCardDataUtils.numSymbols;

  // This should slice up evenly so all purpose numbers have same likelihood of showing up.
  // There are gNumInstancesEachSymbol purpose symbols in the deck.
  const gNumInstancesEachPurposeValue =
    gNumInstancesEachSymbol / gMaxPurposeValue;
  console.assert(
    gNumInstancesEachPurposeValue == Math.floor(gNumInstancesEachPurposeValue),
    "gNumInstancesEachPurposeValue is not an int: gNumInstancesEachPurposeValue = " +
      gNumInstancesEachPurposeValue +
      ", gNumInstancesEachSymbol = " +
      gNumInstancesEachSymbol +
      ", gMaxPurpose = " +
      gMaxPurposeValue
  );

  //-----------------------------------
  //
  // Global functions
  //

  //-----------------------------------
  //
  // Functions
  //
  //-----------------------------------
  function getCardConfigAtIndex(index) {
    return cards.getCardConfigAtIndex(gCardConfigs, index);
  }

  function generateCardConfigs() {
    debugLog("triangleCardData", "gTotalCardsInDeck = " + gTotalCardsInDeck);
    debugLog("triangleCardData", "gNumSymbolsPerCard = " + gNumSymbolsPerCard);
    debugLog(
      "triangleCardData",
      "gTotalSymbolsInDeck = " + gTotalSymbolsInDeck
    );
    debugLog(
      "triangleCardData",
      "gNumInstancesEachSymbol = " + gNumInstancesEachSymbol
    );

    lagomCardDataUtils.setNumberingDetailsForSymbol(
      lagomCardDataUtils.symbolTypes.Purpose,
      1,
      gMaxPurposeValue,
      gNumInstancesEachPurposeValue
    );

    gCardConfigs = lagomCardDataUtils.generateCardConfigs(
      gTotalCardsInDeck,
      gValidDistributions
    );
  }

  function getNumCards() {
    debugLog(
      "triangleCardData",
      "getNumCards: _cardConfigs = " + JSON.stringify(gCardConfigs)
    );
    return cards.getNumCardsFromConfigs(gCardConfigs);
  }

  // This returned object becomes the defined value of this module
  return {
    getNumCards: getNumCards,
    getCardConfigAtIndex: getCardConfigAtIndex,
    generateCardConfigs: generateCardConfigs,
  };
});
