/* Deprecated */

define([
  "dojo/dom-style",
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericUtils",
  "sharedJavascript/htmlUtils",
  "javascript/cardData",
  "dojo/domReady!",
], function (domStyle, cards, debugLog, genericUtils, htmlUtils, cardData) {
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

  const imageRotationByQuadIndex = [-45, 45, 45, -45];

  var discardIconSize = 20;

  //-----------------------------------
  //
  // Functions
  //
  //-----------------------------------
  function layoutPseudoImage(
    imageNode,
    quadIndex,
    totalResourceCount,
    imageIndex
  ) {
    debugLog.debugLog(
      "Cards",
      "Doug: layoutPseudoImage: quadIndex = " +
        quadIndex +
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

    var rotation = imageRotationByQuadIndex[quadIndex];
    domStyle.set(imageNode, {
      width: imageSizesByResourceCount[totalResourceCount] + "px",
      height: imageSizesByResourceCount[totalResourceCount] + "px",
      transform: `translate(${translateX}%, ${translateY}%) rotate(${rotation}deg)`,
    });
  }

  function addNthQuad(parentNode, quadIndex, opt_quadDesc) {
    debugLog.debugLog(
      "Cards",
      "Doug addNthQuad: opt_quadDesc = " + JSON.stringify(opt_quadDesc)
    );
    var quadType =
      quadIndex == 0 || quadIndex == 3
        ? cardData.quadTypes.Add
        : cardData.quadTypes.Lose;

    var resourceTypeToResourceCountMap = opt_quadDesc
      ? opt_quadDesc.resourceTypeToResourceCountMap
      : {};

    var totalResourceCount = genericUtils.sumHistogram(
      resourceTypeToResourceCountMap
    );

    var quadNode = htmlUtils.addDiv(
      parentNode,
      [
        "quad",
        "resource-count-" + totalResourceCount,
        "quad-index-" + quadIndex,
        "quad-type-" + quadType,
      ],
      "quad"
    );

    if (totalResourceCount == 0) {
      return quadNode;
    }

    var quadDesc = opt_quadDesc;
    var currentResourceCount = 0;
    for (var resourceType in resourceTypeToResourceCountMap) {
      var thisResourceCount =
        quadDesc.resourceTypeToResourceCountMap[resourceType] || 0;
      if (thisResourceCount <= 0) {
        continue;
      }

      for (var i = 0; i < thisResourceCount; i++) {
        var cssClass = resourceType;
        var imageNode = htmlUtils.addImage(
          quadNode,
          ["resource-image", cssClass],
          "resource-image-" + resourceType + "-" + i
        );
        layoutPseudoImage(
          imageNode,
          quadIndex,
          totalResourceCount,
          currentResourceCount
        );
        currentResourceCount++;
      }
    }
    return quadNode;
  }

  function maybeAddDiscardReward(parent, opt_discardReward) {
    var discardReward = opt_discardReward ? opt_discardReward : 0;

    if (discardReward == 0) {
      return null;
    }

    var rewardWrapperNode = htmlUtils.addDiv(
      parent,
      ["discard-reward-wrapper"],
      "discard-reward-wrapper"
    );

    var discardImageNode = htmlUtils.addImage(
      rewardWrapperNode,
      ["discard"],
      "discard"
    );

    domStyle.set(discardImageNode, {
      width: discardIconSize + "px",
      height: discardIconSize + "px",
    });

    var colonNode = htmlUtils.addDiv(
      rewardWrapperNode,
      ["colon"],
      "colon",
      ":"
    );
    domStyle.set(colonNode, {
      "font-size": discardIconSize + "px",
    });

    // Add the coins.
    for (var j = 0; j < discardReward; j++) {
      var coinNode = htmlUtils.addImage(
        rewardWrapperNode,
        ["coin"],
        "coin-" + j.toString()
      );
      domStyle.set(coinNode, {
        width: discardIconSize + "px",
        height: discardIconSize + "px",
      });
    }
    return rewardWrapperNode;
  }

  function addCardFront(parentNode, index) {
    var cardConfig = cardData.getCardConfigAtIndex(index);
    debugLog.debugLog(
      "Cards",
      "Doug: in addCardFront i == " +
        index +
        " cardConfig = " +
        JSON.stringify(cardConfig)
    );

    var id = "well-played-card-" + index;
    var classes = ["well-played-card"];
    var cardFrontNode = cards.addCardFront(parentNode, classes, id);
    domStyle.set(cardFrontNode, {
      padding: cardFrontPaddingPx + "px",
    });

    var frontWrapperNode = htmlUtils.addDiv(
      cardFrontNode,
      ["front-wrapper"],
      "front-wrapper"
    );

    // 2 rows, 2 quads in each.
    for (var rowIndex = 0; rowIndex < 2; rowIndex++) {
      var rowNode = htmlUtils.addDiv(
        frontWrapperNode,
        ["quads-row", "quads-row-" + rowIndex],
        "quads-row-" + rowIndex
      );

      for (var columnIndex = 0; columnIndex < 2; columnIndex++) {
        var quadIndex = rowIndex * 2 + columnIndex;
        var quadDesc = null;
        for (var k = 0; k < cardConfig.quadDescs.length; k++) {
          var qd = cardConfig.quadDescs[k];
          if (qd.quadIndex == quadIndex) {
            quadDesc = qd;
            break;
          }
        }

        addNthQuad(rowNode, quadIndex, quadDesc);
      }
    }

    maybeAddDiscardReward(cardFrontNode, cardConfig.discardReward);
    return cardFrontNode;
  }

  function addCardBack(parent, index) {
    var cardBackNode = cards.addCardBack(parent, index, {
      classes: ["well-played-card"],
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
