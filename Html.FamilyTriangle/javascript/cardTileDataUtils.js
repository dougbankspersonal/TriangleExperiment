define(["dojo/domReady!"], function () {
  //-----------------------------------
  //
  // Global state.
  //
  //-----------------------------------

  //-----------------------------------
  //
  // Functions
  //
  //-----------------------------------
  function terrainTypeToTextureSectorClass(terrainType) {
    return "tri-texture-" + terrainType;
  }

  function terrrainTypeArrayToSectorDescriptors(terrainTypeArray) {
    var sectorDescriptors = [];
    console.assert(
      terrainTypeArray.length === 4,
      "terrainTypeArray.length !== 4",
    );
    for (var i = 0; i < terrainTypeArray.length; i++) {
      var triangleTerrainType = terrainTypeToTextureSectorClass(
        terrainTypeArray[i],
      );
      var sectorDescriptor = { classes: [triangleTerrainType] };
      sectorDescriptors.push(sectorDescriptor);
    }
    return sectorDescriptors;
  }

  function terrainTypeArrayToCardConfig(terrainTypeArray) {
    var sectorDescriptors =
      terrrainTypeArrayToSectorDescriptors(terrainTypeArray);
    var cardConfig = {
      sectorDescriptors: sectorDescriptors,
      classes: ["color"],
      overlayClass: "color-overlay",
    };
    return cardConfig;
  }

  // This returned object becomes the defined value of this module
  return {
    terrainTypeToSectorClass: terrainTypeToTextureSectorClass,
    terrrainTypeArrayToSectorDescriptors: terrrainTypeArrayToSectorDescriptors,
    terrainTypeArrayToCardConfig: terrainTypeArrayToCardConfig,
  };
});
