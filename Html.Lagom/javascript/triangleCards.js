/* Deprecated */

define([
  "dojo/dom-style",
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericUtils",
  "sharedJavascript/htmlUtils",
  "javascript/triangleCardData",
  "dojo/domReady!",
], function (
  domStyle,
  cards,
  debugLog,
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

  const discardIconSize = 20;
  const _discardRewardSupported = false;

  //-----------------------------------
  //
  // Functions
  //
  //-----------------------------------
  function layoutPseudoImage(
    imageNode,
    sectorIndex,
    totalResourceCount,
    imageIndex
  ) {
    debugLog.debugLog(
      "Cards",
      "Doug: layoutPseudoImage: sectorIndex = " +
        sectorIndex +
        " totalResourceCount = " +
        totalResourceCount +
        " imageIndex = " +
        imageIndex
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

    debugLog.debugLog(
      "Cards",
      "Doug: layoutPseudoImage: totalResourceCount = " +
        JSON.stringify(totalResourceCount)
    );
    debugLog.debugLog(
      "Cards",
      "Doug: layoutPseudoImage: imageIndex = " + JSON.stringify(imageIndex)
    );

    var translateX =
      imageTranslateXByResourceCountAndIndex[totalResourceCount][imageIndex];
    var translateY =
      imageTranslateYByResourceCountAndIndex[totalResourceCount][imageIndex];
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
      width: imageSizesByResourceCount[totalResourceCount] + "px",
      height: imageSizesByResourceCount[totalResourceCount] + "px",
      transform: `translate(${translateX}%, ${translateY}%) rotate(${rotation}deg)`,
    });
  }

  function addNthSector(parentNode, sectorIndex, opt_sectorDesc) {
    debugLog.debugLog(
      "Cards",
      "Doug addNthSector: opt_sectorDesc = " + JSON.stringify(opt_sectorDesc)
    );

    var sectorMap = opt_sectorDesc ? opt_sectorDesc.sectorMap : {};

    var totalResourceCount = genericUtils.sumHistogram(sectorMap);

    var sectorNode = htmlUtils.addDiv(
      parentNode,
      [
        "sector",
        "symbol-count-" + totalResourceCount,
        "symbol-index-" + sectorIndex,
      ],
      "sector"
    );

    if (totalResourceCount == 0) {
      return sectorNode;
    }

    var sectorDesc = opt_sectorDesc;
    var currentResourceCount = 0;
    for (var resourceType in sectorMap) {
      var thisResourceCount = sectorDesc.sectorMap[resourceType] || 0;
      if (thisResourceCount <= 0) {
        continue;
      }

      for (var i = 0; i < thisResourceCount; i++) {
        var cssClass = resourceType;
        var imageNode = htmlUtils.addImage(
          sectorNode,
          ["symbol-image", cssClass],
          "symbol-image-" + resourceType + "-" + i
        );
        layoutPseudoImage(
          imageNode,
          sectorIndex,
          totalResourceCount,
          currentResourceCount
        );
        currentResourceCount++;

        if (resourceType == triangleCardData.symbolTypes.Purpose) {
          var purposeNumber = sectorDesc.purposeNumbers.shift();
          var purposeNumberNode = htmlUtils.addDiv(
            imageNode,
            ["symbol-number"],
            "symbol-number",
            purposeNumber
          );
        }
      }
    }
    return sectorNode;
  }

  function addCardFront(parentNode, index) {
    console.log("DougTmp: addCardFront: index = ", index);
    var cardConfig = triangleCardData.getCardConfigAtIndex(index);
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

    var id = "lagom-card-" + index;
    var classes = ["lagom-card"];
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
        var sectorDesc = null;
        for (var k = 0; k < cardConfig.sectorDescriptors.length; k++) {
          var sectorDescriptor = cardConfig.sectorDescriptors[k];
          if (sectorDescriptor.sectorIndex == sectorIndex) {
            sectorDesc = sectorDescriptor;
            break;
          }
        }

        addNthSector(rowNode, sectorIndex, sectorDesc);
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
