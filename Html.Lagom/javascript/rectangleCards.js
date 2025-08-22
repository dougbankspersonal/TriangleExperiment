/* Deprecated */

define([
  "dojo/dom-style",
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericUtils",
  "sharedJavascript/htmlUtils",
  "javascript/rectangleCardData",
  "dojo/domReady!",
], function (
  domStyle,
  cards,
  debugLog,
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
  const imageSizesByResourceCount = {
    1: 80,
    2: 65,
    3: 50,
  };

  const imageTranslateXByResourceCountAndIndex = {
    1: [-50],
    2: [-25, -75],
    3: [-90, -90, 10],
  };
  const imageTranslateYByResourceCountAndIndex = {
    1: [-50],
    2: [-100, -0],
    3: [-125, 25, -50],
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
    symbolIndexInSector
  ) {
    debugLog.debugLog(
      "Cards",
      "Doug: layoutPseudoImage: sectorIndex = " +
        sectorIndex +
        " symbolsThisSector = " +
        symbolsThisSector +
        " symbolIndexInSector = " +
        symbolIndexInSector
    );

    debugLog.debugLog(
      "Cards",
      "Doug: layoutPseudoImage: imageSizesByResourceCount = " +
        JSON.stringify(imageSizesByResourceCount)
    );

    debugLog.debugLog(
      "Cards",
      "Doug: layoutPseudoImage: imageTranslateXByResourceCountAndIndex = " +
        JSON.stringify(imageTranslateXByResourceCountAndIndex)
    );
    debugLog.debugLog(
      "Cards",
      "Doug: layoutPseudoImage: imageTranslateYByResourceCountAndIndex = " +
        JSON.stringify(imageTranslateXByResourceCountAndIndex)
    );

    var translateX =
      imageTranslateXByResourceCountAndIndex[symbolsThisSector][
        symbolIndexInSector
      ];
    var translateY =
      imageTranslateYByResourceCountAndIndex[symbolsThisSector][
        symbolIndexInSector
      ];
    debugLog.debugLog(
      "Cards",
      "Doug: layoutPseudoImage: translateX = " + JSON.stringify(translateX)
    );
    debugLog.debugLog(
      "Cards",
      "Doug: layoutPseudoImage: translateY = " + JSON.stringify(translateY)
    );

    var rotation = gImageRotationBySectorIndex[sectorIndex];
    domStyle.set(imageNode, {
      width: imageSizesByResourceCount[symbolsThisSector] + "px",
      height: imageSizesByResourceCount[symbolsThisSector] + "px",
      transform: `translate(${translateX}%, ${translateY}%) rotate(${rotation}deg)`,
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
    console.log("DougTmp: addCardFront: index = ", index);
    var cardConfig = rectangleCardData.getCardConfigAtIndex(index);
    console.log(
      "DougTmp: addCardFront: cardConfig = ",
      JSON.stringify(cardConfig)
    );
    debugLog.debugLog(
      "Cards",
      "Doug: in addCardFront i == " +
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

        addNthSector(rowNode, sectorIndex, sectorDescriptor);
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
