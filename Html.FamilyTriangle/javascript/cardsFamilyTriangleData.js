// 207.846pxs

/*
Tightly bound with hoaDeckConfigConstruction.js

hoaDeckConfigConstruction describes a deck of cards in "HOA" specific terms.
This translates into an array of card configs using generic "triangle cards" terms, these can
be passed off to triangleCards shared code to generate actual cards.
*/
define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "dojo/domReady!",
], function (cards, debugLogModule) {
  var debugLog = debugLogModule.debugLog;
  //-----------------------------------
  //
  // Constants
  //
  //-----------------------------------
  const gTerrainTypeGrass = "grass";
  const gTerrainTypePath = "path";
  const gTerrainTypeWater = "water";
  const gTerrainTypeWaterPath = "water-path";

  const gTerrainTypes = {
    Grass: gTerrainTypeGrass,
    Path: gTerrainTypePath,
    Water: gTerrainTypeWater,
    WaterPath: gTerrainTypeWaterPath,
  };

  const gTerrainTypesArray = Object.values(gTerrainTypes);

  const gPristineCardConfigs = [
    {
      sectorDescriptors: [
        { classes: [gTerrainTypes.Grass] },
        { classes: [gTerrainTypes.Path] },
        { classes: [gTerrainTypes.Water] },
        { classes: [gTerrainTypes.WaterPath] },
      ],
    },
    {
      sectorDescriptors: [
        { classes: [gTerrainTypes.Grass] },
        { classes: [gTerrainTypes.Grass] },
        { classes: [gTerrainTypes.Water] },
        { classes: [gTerrainTypes.Path] },
      ],
    },
    {
      sectorDescriptors: [
        { classes: [gTerrainTypes.Path] },
        { classes: [gTerrainTypes.Water] },
        { classes: [gTerrainTypes.Path] },
        { classes: [gTerrainTypes.Grass] },
      ],
    },
  ];

  //-----------------------------------
  //
  // Global state.
  //
  //-----------------------------------
  var gCardConfigs = null;

  //-----------------------------------
  //
  // Functions
  //
  //-----------------------------------
  function decorateCardConfig(cardConfig) {
    cardConfig.classes = ["family-triangle"];
    cardConfig.borderSizePix = 8;
    cardConfig.overlayClass = "family-triangle-overlay";
    return cardConfig;
  }

  function generateCardConfigs(deckConfig) {
    console.assert(gCardConfigs === null, "generateCardConfigs called twice");
    gCardConfigs = [];
    for (var config of gPristineCardConfigs) {
      var copiedConfig = structuredClone(config);
      var decoratedConfig = decorateCardConfig(copiedConfig);
      gCardConfigs.push(decoratedConfig);
    }
    return gCardConfigs;
  }

  function getCardConfigs() {
    console.assert(
      gCardConfigs,
      "getNumCards called before generateCardConfigs",
    );
    debugLog("getCardConfigs: gCardConfigs.length = ", gCardConfigs.length);
    return gCardConfigs;
  }

  function getNumCards() {
    console.assert(
      gCardConfigs,
      "getNumCards called before generateCardConfigs",
    );
    return cards.getNumCardsFromConfigs(gCardConfigs);
  }

  // This returned object becomes the defined value of this module
  return {
    terrainTypes: gTerrainTypes,
    terrainTypesArray: gTerrainTypesArray,
    generateCardConfigs: generateCardConfigs,
    getCardConfigs: getCardConfigs,
    getNumCards: getNumCards,
  };
});
