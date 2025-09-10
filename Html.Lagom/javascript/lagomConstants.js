define([
  "sharedJavascript/debugLog",
  "sharedJavascript/genericUtils",
  "dojo/domReady!",
], function (debugLogModule, genericUtils) {
  var debugLog = debugLogModule.debugLog;

  // Both squares and triangles have four sectors.
  // Triangle sectors are indexed like so:
  //                 0
  //                 2
  //               1    3
  const gNumSectorsPerCard = 4;
  const gTriangleMiddleSectorIndex = 2;

  const gMaxPlayers = 4;

  const SymbolType_Relationships = "wc-relationships";
  const SymbolType_Wealth = "wc-wealth";
  const SymbolType_Purpose = "wc-purpose";
  const SymbolType_Accomplishment = "wc-accomplishment";
  const SymbolType_Parent = "wc-parent  ";

  const gSymbolTypes = {
    Relationships: SymbolType_Relationships,
    Wealth: SymbolType_Wealth,
    Purpose: SymbolType_Purpose,
    Accomplishment: SymbolType_Accomplishment,
    Parent: SymbolType_Parent,
  };

  const gSymbolTypesSet = new Set([
    SymbolType_Relationships,
    SymbolType_Wealth,
    SymbolType_Purpose,
    SymbolType_Accomplishment,
  ]);

  const gSymbolTypesArray = [
    gSymbolTypes.Relationships,
    gSymbolTypes.Wealth,
    gSymbolTypes.Purpose,
    gSymbolTypes.Accomplishment,
  ];

  const transparencyForColors = 0.2;
  const gSymbolToColorMap = {
    [gSymbolTypes.Relationships]: `rgba(128, 255, 128, ${transparencyForColors})`,
    [gSymbolTypes.Wealth]: `rgba(255, 255, 128, ${transparencyForColors})`,
    [gSymbolTypes.Purpose]: `rgba(255, 0, 0, ${transparencyForColors})`,
    [gSymbolTypes.Accomplishment]: `rgba(0, 128, 255, ${transparencyForColors})`,
  };

  const gNumSymbols = gSymbolTypesArray.length;

  const getRandomZeroToOne =
    genericUtils.createSeededGetZeroToOneRandomFunction(36593650);

  const gPurposeSpriteRows = 3;
  const gPurposeSpriteColumns = 3;

  return {
    numSectorsPerCard: gNumSectorsPerCard,
    symbolTypes: gSymbolTypes,
    symbolTypesArray: gSymbolTypesArray,
    numSymbols: gNumSymbols,
    purposeSpriteColumns: gPurposeSpriteColumns,
    purposeSpriteRows: gPurposeSpriteRows,
    numPurposeSprites: gPurposeSpriteColumns * gPurposeSpriteRows,
    getRandomZeroToOne: getRandomZeroToOne,
    maxPlayers: gMaxPlayers,
    triangleMiddleSectorIndex: gTriangleMiddleSectorIndex,
    symbolTypesSet: gSymbolTypesSet,
  };
});
