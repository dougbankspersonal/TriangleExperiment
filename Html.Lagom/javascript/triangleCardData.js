define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "javascript/deckConfigUtils",
  "javascript/distributions",
  "javascript/cardConfigConstruction",
  "javascript/lagomConstants",
  "dojo/domReady!",
], function (
  cards,
  debugLogModule,
  deckConfigUtils,
  distributions,
  cardConfigConstruction,
  lagomConstants
) {
  var debugLog = debugLogModule.debugLog;

  //-----------------------------------
  //
  // Constants
  //
  //-----------------------------------
  var gCardConfigs = [];

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
    const gCardsInThreeSymbolDeck = 64;
    const g3_4_DeckConfig = deckConfigUtils.generateDeckConfig(
      gCardsInThreeSymbolDeck,
      3,
      4,
      {
        [lagomConstants.symbolTypes.Accomplishment]: 2,
        [lagomConstants.symbolTypes.Purpose]: 2,
        [lagomConstants.symbolTypes.Relationships]: 2,
        [lagomConstants.symbolTypes.Wealth]: 2,
      },
      cardConfigConstruction.twoWealthOneRelationshipStarterConfig,
      {},
      distributions.middleIsNotBlankDistributionCheck
    );

    // 5 symbol, 8 purpose, 1 coin max per card.
    const gCardsInFiveSymbolDeck = 64;
    const g5_8_WealthCap_DeckConfig = deckConfigUtils.generateDeckConfig(
      gCardsInFiveSymbolDeck,
      5,
      8,
      {
        [lagomConstants.symbolTypes.Accomplishment]: 2,
        [lagomConstants.symbolTypes.Purpose]: 2,
        [lagomConstants.symbolTypes.Relationships]: 2,
        [lagomConstants.symbolTypes.Wealth]: 1,
      },
      cardConfigConstruction.threeWealthStarterConfig,
      {
        // Usually symbols are equally represented: here we say there's
        // only so many wealth symbols, fewer than normal.
        [lagomConstants.symbolTypes.Wealth]: Math.ceil(
          gCardsInFiveSymbolDeck * 0.75
        ),
      }
    );

    const g5_4_WealthCap_DeckConfig = deckConfigUtils.generateDeckConfig(
      gCardsInFiveSymbolDeck,
      5,
      4,
      {
        [lagomConstants.symbolTypes.Accomplishment]: 2,
        [lagomConstants.symbolTypes.Purpose]: 2,
        [lagomConstants.symbolTypes.Relationships]: 2,
        [lagomConstants.symbolTypes.Wealth]: 1,
      },
      cardConfigConstruction.threeWealthStarterConfig,
      {
        // Usually symbols are equally represented: here we say there's
        // only so many wealth symbols, fewer than normal.
        [lagomConstants.symbolTypes.Wealth]: Math.ceil(
          gCardsInFiveSymbolDeck * 0.75
        ),
      }
    );

    var deckConfig = g5_8_WealthCap_DeckConfig;

    gCardConfigs = cardConfigConstruction.generateCardConfigs(deckConfig);
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
