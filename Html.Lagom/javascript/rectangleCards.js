/* Deprecated */

define([
  "dojo/dom-style",
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericMeasurements",
  "sharedJavascript/genericUtils",
  "sharedJavascript/htmlUtils",
  "javascript/rectangleCardData",
  "dojo/domReady!",
], function (
  domStyle,
  cards,
  debugLog,
  genericMeasurements,
  genericUtils,
  htmlUtils,
  rectangleCardData
) {
  //-----------------------------------
  //
  // Constants
  //
  //-----------------------------------
  const cardFrontPaddingPx = 0;

  const rect_imageSizePxByResourceCount = {
    1: genericMeasurements.standardCardWidthPx * 0.33,
    2: genericMeasurements.standardCardWidthPx * 0.271,
    3: genericMeasurements.standardCardWidthPx * 0.24,
  };

  const square_imageSizePxByResourceCount = {
    1: genericMeasurements.standardCardWidthPx * 0.33,
    2: genericMeasurements.standardCardWidthPx * 0.271,
    3: genericMeasurements.standardCardWidthPx * 0.208,
  };

  const rect_imageXPercentByResourceCountAndIndex = {
    1: [0],
    2: [25, -25],
    3: [-35, 35, -35],
  };

  const square_imageXPercentByResourceCountAndIndex = {
    1: [0],
    2: [35, -35],
    3: [-45, 0, 45],
  };

  const rect_imageYPercentByResourceCountAndIndex = {
    1: [0],
    2: [-40, 40],
    3: [-75, 0, 75],
  };

  const square_imageYPercentByResourceCountAndIndex = {
    1: [0],
    2: [-35, 35],
    3: [-45, 45, -45],
  };

  const gImageRotationBySectorIndex = [-45, 45, 45, -45];

  var discardIconSize = 20;
  var _discardRewardSupported = false;

  //-----------------------------------
  //
  // Functions
  //
  //-----------------------------------
  function layoutPseudoImage(
    imageNode,
    sectorIndex,
    symbolsThisSector,
    symbolIndexInSector,
    isSquare
  ) {
    debugLog.debugLog(
      "Cards",
      "layoutPseudoImage: sectorIndex = " +
        sectorIndex +
        " symbolsThisSector = " +
        symbolsThisSector +
        " symbolIndexInSector = " +
        symbolIndexInSector
    );

    var xVals = isSquare
      ? square_imageXPercentByResourceCountAndIndex
      : rect_imageXPercentByResourceCountAndIndex;
    var translateX = xVals[symbolsThisSector][symbolIndexInSector];

    var yVals = isSquare
      ? square_imageYPercentByResourceCountAndIndex
      : rect_imageYPercentByResourceCountAndIndex;

    var translateY = yVals[symbolsThisSector][symbolIndexInSector];

    var sizes = isSquare
      ? square_imageSizePxByResourceCount
      : rect_imageSizePxByResourceCount;

    var rotation = gImageRotationBySectorIndex[sectorIndex];
    domStyle.set(imageNode, {
      width: sizes[symbolsThisSector] + "px",
      height: sizes[symbolsThisSector] + "px",
      transform: `translate(${translateX}%, ${translateY}%) rotate(${rotation}deg)`,
    });
  }

  function addNthSector(
    parentNode,
    sectorIndex,
    isSquare,
    opt_sectorDescriptor
  ) {
    var sectorDescriptor = opt_sectorDescriptor ? opt_sectorDescriptor : {};

    var sectorMap = sectorDescriptor ? sectorDescriptor.sectorMap : {};

    var symbolsThisSector = genericUtils.sumHistogram(sectorMap);

    var sectorNode = htmlUtils.addDiv(
      parentNode,
      [
        "sector",
        "symbol-count-" + symbolsThisSector,
        "sector-index-" + sectorIndex,
      ],
      "sector"
    );
    if (symbolsThisSector == 0) {
      return sectorNode;
    }

    var symbolIndexInSector = 0;
    for (var symbolType in sectorMap) {
      var symbolCount = sectorMap[symbolType] || 0;
      if (symbolCount <= 0) {
        continue;
      }

      var numbersForSymbol = null;
      if (
        sectorDescriptor.numbersBySymbolType &&
        sectorDescriptor.numbersBySymbolType[symbolType]
      ) {
        numbersForSymbol = sectorDescriptor.numbersBySymbolType[symbolType];
      }

      for (var symbolIndex = 0; symbolIndex < symbolCount; symbolIndex++) {
        var cssClass = symbolType;
        var imageNode = htmlUtils.addImage(
          sectorNode,
          ["symbol-image", cssClass],
          "symbol-image-" + symbolType + "-" + symbolIndex
        );
        layoutPseudoImage(
          imageNode,
          sectorIndex,
          symbolsThisSector,
          symbolIndexInSector,
          isSquare
        );
        symbolIndexInSector++;

        if (numbersForSymbol) {
          console.assert(symbolIndex < numbersForSymbol.length);
          var number = numbersForSymbol[symbolIndex];
          var numberNode = htmlUtils.addDiv(
            imageNode,
            ["symbol-number"],
            "symbol-number",
            number.toString()
          );
        }
      }
    }
    return sectorNode;
  }

  function addCardFront(parentNode, index, opt_configs) {
    console.log(
      "Doug: genericMeasurements.standardCardWidthPx = " +
        genericMeasurements.standardCardWidthPx
    );

    var configs = opt_configs ? opt_configs : {};

    var cardConfig = rectangleCardData.getCardConfigAtIndex(index);
    debugLog.debugLog(
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
      padding: cardFrontPaddingPx + "px",
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

        addNthSector(rowNode, sectorIndex, configs.isSquare, sectorDescriptor);
      }
    }

    return cardFrontNode;
  }

  function addCardBack(parent, index) {
    var cardBackNode = cards.addCardBack(parent, index, {
      classes: ["lagom"],
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
