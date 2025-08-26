/* Deprecated */

define([
  "dojo/dom-style",
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericMeasurements",
  "sharedJavascript/htmlUtils",
  "javascript/lagomCardUtils",
  "javascript/rectangleCardData",
  "dojo/domReady!",
], function (
  domStyle,
  cards,
  debugLogModule,
  genericMeasurements,
  htmlUtils,
  lagomCardUtils,
  rectangleCardData
) {
  var debugLog = debugLogModule.debugLog;

  //-----------------------------------
  //
  // Constants
  //
  //-----------------------------------
  const gCardFrontPaddingPx = 0;

  const gRect_symbolSizePxBySymbolCount = {
    1: genericMeasurements.standardCardWidthPx * 0.33,
    2: genericMeasurements.standardCardWidthPx * 0.271,
    3: genericMeasurements.standardCardWidthPx * 0.24,
  };

  const gSquare_symbolSizePxBySymbolCount = {
    1: genericMeasurements.standardCardWidthPx * 0.33,
    2: genericMeasurements.standardCardWidthPx * 0.211,
    3: genericMeasurements.standardCardWidthPx * 0.208,
  };

  const gSectorWidth = genericMeasurements.standardCardWidthPx / 2;
  const gSquareSectorHeight = gSectorWidth;
  const gRectSectorHeight = genericMeasurements.standardCardHeightPx / 2;
  const gRect_symbolXPxBySymbolCountAndIndex = {
    1: [0],
    2: [0.17 * gSectorWidth, -0.17 * gSectorWidth],
    3: [-0.2 * gSectorWidth, 0, 0.2 * gSectorWidth],
  };

  const gRect_symbolYPxBySymbolCountAndIndex = {
    1: [0],
    2: [0.22 * gSquareSectorHeight, -0.22 * gSquareSectorHeight],
    3: [
      -0.27 * gSquareSectorHeight,
      0.27 * gSquareSectorHeight,
      -0.27 * gSquareSectorHeight,
    ],
  };

  const gSquare_symbolXPxBySymbolCountAndIndex = {
    1: [0],
    2: [0.17 * gSectorWidth, -0.17 * gSectorWidth],
    3: [-0.2 * gSectorWidth, 0, 0.2 * gSectorWidth],
  };

  const gSquare_symbolYPxBySymbolCountAndIndex = {
    1: [0],
    2: [0.17 * gSquareSectorHeight, -0.17 * gSquareSectorHeight],
    3: [
      -0.2 * gSquareSectorHeight,
      0.2 * gSquareSectorHeight,
      -0.2 * gSquareSectorHeight,
    ],
  };

  const gSymbolRotationDegBySectorIndex = [-45, 45, 45, -45];

  //-----------------------------------
  //
  // Functions
  //
  //-----------------------------------
  function addCardFront(parentNode, index, opt_configs) {
    var configs = opt_configs ? opt_configs : {};

    var cardConfig = rectangleCardData.getCardConfigAtIndex(index);
    debugLog(
      "Cards",
      "in addCardFront i == " +
        index +
        " cardConfig = " +
        JSON.stringify(cardConfig)
    );

    var id = "lagom-" + index;
    var classes = ["lagom"];
    var cardFrontNode = cards.addCardFront(parentNode, classes, id);
    domStyle.set(cardFrontNode, {
      padding: gCardFrontPaddingPx + "px",
      "border-width": `${genericMeasurements.cardFrontBorderWidthPx}px`,
      "border-style": "solid",
    });

    var frontWrapperNode = htmlUtils.addDiv(
      cardFrontNode,
      ["front-wrapper"],
      "front-wrapper"
    );

    // 2 rows, 2 sectors in each.
    for (var rowIndex = 0; rowIndex < 2; rowIndex++) {
      var rowNode = htmlUtils.addDiv(
        frontWrapperNode,
        ["sectors-row", "sectors-row-" + rowIndex],
        "sectors-row-" + rowIndex
      );

      for (var columnIndex = 0; columnIndex < 2; columnIndex++) {
        var sectorIndex = rowIndex * 2 + columnIndex;
        var sectorDescriptor = cardConfig.sectorDescriptors[sectorIndex];
        console.assert(sectorDescriptor, "sectorDescriptor is null");

        var sectorConfigs = {
          isSquare: configs.isSquare === true,
          symbolSizePxBySymbolCount:
            configs.isSquare === true
              ? gSquare_symbolSizePxBySymbolCount
              : gRect_symbolSizePxBySymbolCount,
          symbolXPxBySymbolCountAndIndex:
            configs.isSquare === true
              ? gSquare_symbolXPxBySymbolCountAndIndex
              : gRect_symbolXPxBySymbolCountAndIndex,
          symbolYPxBySymbolCountAndIndex:
            configs.isSquare === true
              ? gSquare_symbolYPxBySymbolCountAndIndex
              : gRect_symbolYPxBySymbolCountAndIndex,
          symbolRotationsDeg: gSymbolRotationDegBySectorIndex,
          sectorDescriptor: sectorDescriptor,
        };

        lagomCardUtils.addNthSector(rowNode, sectorIndex, sectorConfigs);
      }
    }

    return cardFrontNode;
  }

  function addCardBack(parent, index) {
    var cardBackNode = cards.addCardBack(parent, index, {
      classes: ["lagom"],
    });
    domStyle.set(cardBackNode, {
      "border-width": `${genericMeasurements.cardFrontBorderWidthPx}px`,
      "border-style": "solid",
    });
    var titleImageNode = htmlUtils.addImage(
      cardBackNode,
      ["lagom-title-shadow"],
      "title"
    );
    return cardBackNode;
  }

  // This returned object becomes the defined value of this module
  return {
    addCardFront: addCardFront,
    addCardBack: addCardBack,
  };
});
