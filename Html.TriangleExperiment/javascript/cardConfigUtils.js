/*
Generic functions for reading/digesting card configs.

A cardConfig is:
  season: int, indicates season of card, used to style.
  isStarterCard: opt bool, if true this is a starter.
  sectorDescriptors: array of sector descriptors, array index -> sector index.

A sector descriptor is:
  sectorMap: maps symbol type to count of that symbol in sector.
  numbersBySymbolType: if a symbol has to be numbered, maps the symbol to an array of numbers to use.
*/

define(["sharedJavascript/debugLog", "dojo/domReady!"], function (
  debugLogModule
) {
  var debugLog = debugLogModule.debugLog;

  //------------------------------------------
  //
  // functions
  //
  //------------------------------------------
  // Given a card config:
  // Return a map from symbl type to the number of times it appears on the entire card.
  function getCountsBySymbol(cardConfig) {
    var countsBySymbol = {};
    for (
      var sectorIndex = 0;
      sectorIndex < cardConfig.sectorDescriptors.length;
      sectorIndex++
    ) {
      var sectorMap = cardConfig.sectorDescriptors[sectorIndex].sectorMap;
      for (var symbolType in sectorMap) {
        if (!countsBySymbol[symbolType]) {
          countsBySymbol[symbolType] = 0;
        }
        countsBySymbol[symbolType] += sectorMap[symbolType];
      }
    }
    return countsBySymbol;
  }

  // This returned object becomes the defined value of this module
  return {
    getCountsBySymbol: getCountsBySymbol,
  };
});
