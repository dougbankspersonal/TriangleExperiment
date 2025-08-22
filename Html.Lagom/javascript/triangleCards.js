/* Deprecated */

define([
  "dojo/dom-style",
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericMeasurements",
  "sharedJavascript/genericUtils",
  "sharedJavascript/htmlUtils",
  "javascript/triangleCardData",
  "dojo/domReady!",
], function (
  domStyle,
  cards,
  debugLog,
  genericMeasurements,
  genericUtils,
  htmlUtils,
  triangleCardData
) {
  //-----------------------------------
  //
  // Constants
  //
  //-----------------------------------
  const cardFrontPaddingPx = 0;

  var discardIconSize = 20;
  var _discardRewardSupported = false;

  // Triangle height = base/2 * rad(3).
  // Row height is half that.
  var rowHeight = (genericMeasurements.standardCardWidthPx * Math.sqrt(3)) / 4;
  var sectorWidth = genericMeasurements.standardCardWidthPx / 2;

  // This seems to need fudging a bit.
  rowHeight += 2;

  var sectorWidth = genericMeasurements.standardCardWidthPx / 2;

  const imageSizesByResourceCount = {
    1: rowHeight * 0.5,
    2: rowHeight * 0.3,
  };

  // Euquilateral triangle: centeredd

  const imageTranslateXByResourceCountAndIndex = {
    // One symbol: center in triangle.
    1: [0],
    // Two symbols: center in X, stagger in Y.
    2: [0, 0],
  };

  var smallImageSizeY = imageSizesByResourceCount[2];
  var uprightCenter = smallImageSizeY / 2 - rowHeight / 3;
  var invertedUprightCenter = smallImageSizeY / 2 - (2 * rowHeight) / 3;

  const marginFor2Symbols = smallImageSizeY / 8;
  const yOffsetFor2Symbols = -rowHeight / 10;

  const imageTranslateYByResourceCountAndIndex = {
    // Item is aligned with bottom by default.
    // Go down 1/2 the height of image, then up 1/3 of height of row.
    1: [imageSizesByResourceCount[1] / 2 - rowHeight / 3],
    // Two items in a stack spaced around center.
    2: [
      uprightCenter -
        smallImageSizeY / 2 -
        marginFor2Symbols +
        yOffsetFor2Symbols,
      uprightCenter +
        smallImageSizeY / 2 +
        marginFor2Symbols +
        yOffsetFor2Symbols,
    ],
  };

  // Sector 2 is it's own dumb thing because it's upside down.
  const invertedImageTranslateYByResourceCountAndIndex = {
    // Item is aligned with bottom by default.
    // Go down height of image, then up the 2/3 row height.
    1: [imageSizesByResourceCount[1] / 2 - (2 * rowHeight) / 3],
    // Down half height of image then up full height of row.
    // Then one symbol height down from that.
    2: [
      invertedUprightCenter -
        smallImageSizeY / 2 -
        marginFor2Symbols -
        yOffsetFor2Symbols,
      invertedUprightCenter +
        smallImageSizeY / 2 +
        marginFor2Symbols -
        yOffsetFor2Symbols,
    ],
  };

  const sectorXBySectorIndex = [0, -sectorWidth / 2, 0, sectorWidth / 2];
  const sectorYBySectorIndex = [0, 0, 0, 0];

  debugLog.debugLog("Cards", "rowHeight = " + JSON.stringify(rowHeight));
  debugLog.debugLog(
    "Cards",
    "imageSizesByResourceCount = " + JSON.stringify(imageSizesByResourceCount)
  );
  debugLog.debugLog(
    "Cards",
    "imageTranslateYByResourceCountAndIndex = " +
      JSON.stringify(imageTranslateYByResourceCountAndIndex)
  );

  //-----------------------------------
  //
  // Functions
  //
  //-----------------------------------
  function layoutPseudoImage(
    imageNode,
    sectorIndex,
    symbolsThisSector,
    symbolIndexInSector
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

    debugLog.debugLog(
      "Cards",
      "layoutPseudoImage: imageSizesByResourceCount = " +
        JSON.stringify(imageSizesByResourceCount)
    );

    debugLog.debugLog(
      "Cards",
      "layoutPseudoImage: imageTranslateXByResourceCountAndIndex = " +
        JSON.stringify(imageTranslateXByResourceCountAndIndex)
    );
    debugLog.debugLog(
      "Cards",
      "layoutPseudoImage: imageTranslateYByResourceCountAndIndex = " +
        JSON.stringify(imageTranslateXByResourceCountAndIndex)
    );

    var translateX =
      imageTranslateXByResourceCountAndIndex[symbolsThisSector][
        symbolIndexInSector
      ];

    var translateY;
    if (sectorIndex == 2) {
      translateY =
        invertedImageTranslateYByResourceCountAndIndex[symbolsThisSector][
          symbolIndexInSector
        ];
    } else {
      translateY =
        imageTranslateYByResourceCountAndIndex[symbolsThisSector][
          symbolIndexInSector
        ];
    }

    debugLog.debugLog(
      "Cards",
      "layoutPseudoImage: translateX = " + JSON.stringify(translateX)
    );
    debugLog.debugLog(
      "Cards",
      "layoutPseudoImage: translateY = " + JSON.stringify(translateY)
    );

    domStyle.set(imageNode, {
      width: imageSizesByResourceCount[symbolsThisSector] + "px",
      height: imageSizesByResourceCount[symbolsThisSector] + "px",
      transform: `translate(${translateX}px, ${translateY}px)`,
    });
  }

  function addNthSector(parentNode, sectorIndex, opt_sectorDescriptor) {
    debugLog.debugLog(
      "Cards",
      "Doug addNthSector: opt_sectorDescriptor = " +
        JSON.stringify(opt_sectorDescriptor)
    );

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

    var xPos = sectorXBySectorIndex[sectorIndex];
    var yPos = sectorYBySectorIndex[sectorIndex];

    // Force size, position, rotation
    domStyle.set(sectorNode, {
      width: `${sectorWidth}px`,
      height: `${rowHeight}px`,
      transform: `translate(${xPos}px, ${yPos}px)`,
      "transform-origin": "center",
    });

    if (symbolsThisSector == 0) {
      // Add the 'rest' symbol.
      var imageNode = htmlUtils.addImage(
        sectorNode,
        ["symbol-image", "wc-rest"],
        "symbol-image-" + "wc-rest" + "-" + 0
      );
      layoutPseudoImage(imageNode, sectorIndex, 1, 0);

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
          symbolIndexInSector
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

  function addCardFront(parentNode, index) {
    var cardConfig = triangleCardData.getCardConfigAtIndex(index);
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
      border: "none",
      "border-width": "none",
      "border-style": "none",
    });

    var frontWrapperNode = htmlUtils.addDiv(
      cardFrontNode,
      ["front-wrapper"],
      "front-wrapper"
    );

    // 2 rows.  Top has 1 sector, bottom 3.
    var clumnCountByRow = [1, 3];
    var sectorIndex = 0;
    for (var rowIndex = 0; rowIndex < 2; rowIndex++) {
      var rowNode = htmlUtils.addDiv(
        frontWrapperNode,
        ["sectors-row", "sectors-row-" + rowIndex],
        "sectors-row-" + rowIndex
      );
      domStyle.set(rowNode, {
        height: rowHeight + "px",
      });

      var columnCount = clumnCountByRow[rowIndex];
      for (var columnIndex = 0; columnIndex < columnCount; columnIndex++) {
        var sectorDescriptor = cardConfig.sectorDescriptors[sectorIndex];
        console.assert(sectorDescriptor, "sectorDescriptor is null");

        addNthSector(rowNode, sectorIndex, sectorDescriptor);
        sectorIndex++;
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
