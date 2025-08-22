/* Deprecated */

define([
  "dojo/dom-style",
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericUtils",
  "sharedJavascript/htmlUtils",
  "dojo/domReady!",
], function (domStyle, cards, debugLog, genericUtils, htmlUtils) {
  function aggregateSymbolCountMaps(cardConfig) {
    var symbolCountMap = {};
    for (
      var sectorIndex = 0;
      sectorIndex < cardConfig.sectorDescriptors.length;
      sectorIndex++
    ) {
      var sectorMap = cardConfig.sectorDescriptors[sectorIndex].sectorMap;
      for (var symbolType in sectorMap) {
        if (!symbolCountMap[symbolType]) {
          symbolCountMap[symbolType] = 0;
        }
        symbolCountMap[symbolType] += sectorMap[symbolType];
      }
    }
    return symbolCountMap;
  }

  // No symbol should be more than half the symbols.
  function cardHasNiceSymbolBalance(cardConfig) {
    var symbolCountMap = aggregateSymbolCountMaps(cardConfig);
    var totalSymbols = Object.values(symbolCountMap).reduce((a, b) => a + b, 0);
    for (var symbolType in symbolCountMap) {
      if (symbolCountMap[symbolType] > totalSymbols / 2) {
        return false;
      }
    }
    return true;
  }

  // This returned object becomes the defined value of this module
  return {
    cardHasNiceSymbolBalance: cardHasNiceSymbolBalance,
  };
});
