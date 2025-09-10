define([
  "sharedJavascript/debugLog",
  "javascript/deckConfigUtils",
  "javascript/distributions",
  "javascript/lagomConstants",
  "dojo/domReady!",
], function (debugLogModule, deckConfigUtils, distributions, lagomConstants) {
  var debugLog = debugLogModule.debugLog;

  //-------------------------------------------------
  //
  // Constants
  //
  //-------------------------------------------------
  const gDefaultCardCount = 64;

  // Seasonal decks.
  const gSeasonalCardCount = 32;
  const gMaxSeasonalPurpose = 4;

  //----------------------------------------
  //
  // Starter card configs.
  //
  //----------------------------------------
  const gThreeWealthStarterConfig = {
    isStarterCard: true,
    sectorDescriptors: [
      {
        sectorMap: {
          [lagomConstants.symbolTypes.Wealth]: 1,
        },
      },
      {
        sectorMap: {
          [lagomConstants.symbolTypes.Wealth]: 1,
        },
      },
      {
        sectorMap: {
          [lagomConstants.symbolTypes.Parent]: 1,
        },
      },
      {
        sectorMap: {
          [lagomConstants.symbolTypes.Wealth]: 1,
        },
      },
    ],
  };

  const gTwoWealthOneRelationshipStarterConfig = {
    isStarterCard: true,
    sectorDescriptors: [
      {
        sectorMap: {
          [lagomConstants.symbolTypes.Wealth]: 1,
        },
      },
      {
        sectorMap: {
          [lagomConstants.symbolTypes.Wealth]: 1,
        },
      },
      {
        sectorMap: {
          [lagomConstants.symbolTypes.Parent]: 1,
        },
      },
      {
        sectorMap: {
          [lagomConstants.symbolTypes.Relationships]: 1,
        },
      },
    ],
  };

  //-------------------------------------------------
  //
  // Functions
  //
  //-------------------------------------------------

  function generateMIIDBSWithOverrep(
    numCardsInDeck,
    numSymbolsPerCard,
    overrepSymbol
  ) {
    // under reps get less than normal.
    var underep = Math.ceil(
      (numCardsInDeck * numSymbolsPerCard) / (lagomConstants.numSymbols + 1)
    );
    // overrep gets the slop.
    var overrep =
      numCardsInDeck * numSymbolsPerCard -
      underep * (lagomConstants.numSymbols - 1);

    var retVal = {};
    for (var symbolType of lagomConstants.symbolTypesSet) {
      if (symbolType == overrepSymbol) {
        retVal[symbolType] = overrep;
      } else {
        retVal[symbolType] = underep;
      }
    }
    return retVal;
  }

  function getDeckConfig() {
    // A bit about the math on num cards in deck:
    // 4 possible symbols.
    // N symbols per card.
    // Then totalNumSymbols = 4 * N * numCardsInDeck.
    // Then total appearances of any one symbol = (N * numCardsInDeck)/4
    // So, for this to divide nicely, N * numCardsInDeck should be divisible by 4.
    // It's easy enough to just make sure numCardsInDeck is divisible by 4.
    //
    // One symbol is purpose, 1 to MaxPurpose.
    // Num appearances of each purpose number = (N * numCardsInDeck) / (4 * MaxPurpose)
    // This should also divide nicely.
    //
    // So, in short, make sure numCardsInDeck divides evenly by (4 * MaxPurpose)

    // This sets the config for the whole deck.
    // Comment in/out as you see fit.

    // 3 symbol, 4 purpose.
    const g3_4_DeckConfig = deckConfigUtils.generateDeckConfig({
      numNonStarterCardsInDeck: gDefaultCardCount,
      numSymbolsPerCard: 3,
      maxPurposeValue: 4,
      starterCardConfig: gTwoWealthOneRelationshipStarterConfig,
      distributionFilter: distributions.middleIsNotBlank,
    });

    // 5 symbol, 8 purpose, 1 coin max per card.
    const g5_8_WealthCap_DeckConfig = deckConfigUtils.generateDeckConfig({
      numNonStarterCardsInDeck: gDefaultCardCount,
      numSymbolsPerCard: 5,
      maxPurposeValue: 8,
      maxInstancesInCardBySymbol: {
        [lagomConstants.symbolTypes.Accomplishment]: 2,
        [lagomConstants.symbolTypes.Purpose]: 2,
        [lagomConstants.symbolTypes.Relationships]: 2,
        [lagomConstants.symbolTypes.Wealth]: 1,
      },
      starterCardConfig: gThreeWealthStarterConfig,
      maxInstancesInDeckBySymbol: {
        // Usually symbols are equally represented: here we say there's
        // only so many wealth symbols, fewer than normal.
        [lagomConstants.symbolTypes.Wealth]: Math.ceil(
          gDefaultCardCount * 0.75
        ),
      },
      distributionFilter: distributions.middleIsNotBlank,
    });

    const g5_4_WealthCap_DeckConfig = deckConfigUtils.generateDeckConfig({
      numNonStarterCardsInDeck: gDefaultCardCount,
      numSymbolsPerCard: 5,
      maxPurposeValue: 4,
      maxInstancesInCardBySymbol: {
        [lagomConstants.symbolTypes.Accomplishment]: 2,
        [lagomConstants.symbolTypes.Purpose]: 2,
        [lagomConstants.symbolTypes.Relationships]: 2,
        [lagomConstants.symbolTypes.Wealth]: 1,
      },
      starterCardConfig: gThreeWealthStarterConfig,
      maxInstancesInDeckBySymbol: {
        // Usually symbols are equally represented: here we say there's
        // only so many wealth symbols, fewer than normal.
        [lagomConstants.symbolTypes.Wealth]: Math.ceil(
          gDefaultCardCount * 0.75
        ),
      },
      distributionFilter: distributions.middleIsNotBlank,
    });

    //-------------------------------------------------
    //
    // Game has 3 seasons each with it's own deck of 32.
    //
    //-------------------------------------------------
    // Season 1: overrep relationships.
    const gS1_symbolsPerCard = 3;
    const gS1_maxInstancesInDeckBySymbol = generateMIIDBSWithOverrep(
      gSeasonalCardCount,
      gS1_symbolsPerCard,
      lagomConstants.symbolTypes.Relationships
    );

    // Season 2: overrep wealth.
    const gS2_symbolsPerCard = 4;
    const gS2_maxInstancesInDeckBySymbol = generateMIIDBSWithOverrep(
      gSeasonalCardCount,
      gS2_symbolsPerCard,
      lagomConstants.symbolTypes.Wealth
    );

    // Season 3: overrep accomplishment.
    const gS3_symbolsPerCard = 5;
    const gS3_maxInstancesInDeckBySymbol = generateMIIDBSWithOverrep(
      gSeasonalCardCount,
      gS3_symbolsPerCard,
      lagomConstants.symbolTypes.Accomplishment
    );

    // Season 3: overrep purpose.
    const gS4_symbolsPerCard = 5;
    const gS4_maxInstancesInDeckBySymbol = generateMIIDBSWithOverrep(
      gSeasonalCardCount,
      gS4_symbolsPerCard,
      lagomConstants.symbolTypes.Purpose
    );

    const gS1_DeckConfig = deckConfigUtils.generateDeckConfig({
      numNonStarterCardsInDeck: gSeasonalCardCount,
      numSymbolsPerCard: 3,
      maxPurposeValue: gMaxSeasonalPurpose,
      starterCardConfig: gThreeWealthStarterConfig,
      distributionFilter: distributions.middleIsNotBlank,
      maxInstancesInDeckBySymbol: gS1_maxInstancesInDeckBySymbol,
      season: 1,
    });

    const gS2_DeckConfig = deckConfigUtils.generateDeckConfig({
      numNonStarterCardsInDeck: gSeasonalCardCount,
      numSymbolsPerCard: 4,
      maxPurposeValue: gMaxSeasonalPurpose,
      distributionFilter: distributions.middleIsNotBlank,
      maxInstancesInDeckBySymbol: gS2_maxInstancesInDeckBySymbol,
      season: 2,
    });

    const gS3_DeckConfig = deckConfigUtils.generateDeckConfig({
      numNonStarterCardsInDeck: gSeasonalCardCount,
      numSymbolsPerCard: 5,
      maxPurposeValue: gMaxSeasonalPurpose,
      distributionFilter: distributions.middleIsNotBlank,
      maxInstancesInDeckBySymbol: gS3_maxInstancesInDeckBySymbol,
      season: 3,
    });

    const gS4_DeckConfig = deckConfigUtils.generateDeckConfig({
      numNonStarterCardsInDeck: gSeasonalCardCount,
      numSymbolsPerCard: 5,
      maxPurposeValue: gMaxSeasonalPurpose,
      distributionFilter: distributions.middleIsNotBlank,
      maxInstancesInDeckBySymbol: gS4_maxInstancesInDeckBySymbol,
      season: 4,
    });

    return gS2_DeckConfig;
  }

  // This returned object becomes the defined value of this module
  return {
    getDeckConfig: getDeckConfig,
  };
});
