/* Deprecated */

define([
  "dojo/dom-style",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericUtils",
  "sharedJavascript/htmlUtils",
  "dojo/domReady!",
], function (domStyle, debugLogModule, genericUtils, htmlUtils) {
  var debugLog = debugLogModule.debugLog;

  function layoutSymbol(
    symbolNode,
    sectorIndex,
    symbolsThisSector,
    symbolIndexInSector,
    configs
  ) {
    debugLog(
      "Cards",
      "layoutSymbol: sectorIndex = " +
        sectorIndex +
        " symbolsThisSector = " +
        symbolsThisSector +
        " symbolIndexInSector = " +
        symbolIndexInSector
    );

    debugLog("Cards", "symbolsThisSector = ", symbolsThisSector);
    debugLog("Cards", "sectorIndex = ", sectorIndex);
    debugLog("Cards", "configs = ", JSON.stringify(configs));

    var symbolXPixels =
      configs.symbolXPxBySymbolCountAndIndex[symbolsThisSector][
        symbolIndexInSector
      ];
    var symbolYPixels =
      configs.symbolYPxBySymbolCountAndIndex[symbolsThisSector][
        symbolIndexInSector
      ];
    var symbolSizePx = configs.symbolSizePxBySymbolCount[symbolsThisSector];
    var symbolRotationDeg = configs.symbolRotationsDeg
      ? configs.symbolRotationsDeg[sectorIndex]
      : 0;

    debugLog(
      "Positioning",
      "symbolIndexInSector = ",
      JSON.stringify(symbolIndexInSector)
    );
    debugLog("Positioning", "symbolXPixels = ", JSON.stringify(symbolXPixels));
    debugLog("Positioning", "symbolYPixels = ", JSON.stringify(symbolYPixels));
    debugLog("Positioning", "symbolSizePx = ", JSON.stringify(symbolSizePx));
    debugLog(
      "Positioning",
      "symbolRotationDeg = ",
      JSON.stringify(symbolRotationDeg)
    );

    domStyle.set(symbolNode, {
      width: symbolSizePx + "px",
      height: symbolSizePx + "px",
      transform: `translate(${symbolXPixels}px, ${symbolYPixels}px) rotate(${symbolRotationDeg}deg)`,
    });
  }

  function addNthSector(parentNode, sectorIndex, opt_configs) {
    var configs = opt_configs ? opt_configs : {};

    var sectorDescriptor = configs.sectorDescriptor
      ? configs.sectorDescriptor
      : {};

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

    if (configs.sectorStyling) {
      domStyle.set(sectorNode, configs.sectorStyling);
    }

    if (symbolsThisSector == 0) {
      // Add the 'rest' symbol.
      var symbolNode = htmlUtils.addImage(
        sectorNode,
        ["symbol-image", "wc-rest"],
        "symbol-image-" + "wc-rest" + "-" + 0
      );
      layoutSymbol(symbolNode, sectorIndex, 1, 0, configs);

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
        var symbolNode = htmlUtils.addImage(
          sectorNode,
          ["symbol-image", cssClass],
          "symbol-image-" + symbolType + "-" + symbolIndex
        );
        layoutSymbol(
          symbolNode,
          sectorIndex,
          symbolsThisSector,
          symbolIndexInSector,
          configs
        );
        symbolIndexInSector++;

        if (numbersForSymbol) {
          console.assert(symbolIndex < numbersForSymbol.length);
          var number = numbersForSymbol[symbolIndex];
          var numberNode = htmlUtils.addDiv(
            symbolNode,
            ["symbol-number"],
            "symbol-number",
            number.toString()
          );
        }
      }
    }
    return sectorNode;
  }

  // This returned object becomes the defined value of this module
  return {
    addNthSector: addNthSector,
  };
});
