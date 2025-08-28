/* Deprecated */

define([
  "dojo/dom-style",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericUtils",
  "sharedJavascript/htmlUtils",
  "javascript/lagomCardDataUtils",
  "dojo/domReady!",
], function (
  domStyle,
  debugLogModule,
  genericUtils,
  htmlUtils,
  lagomCardDataUtils
) {
  var debugLog = debugLogModule.debugLog;

  const gSymbolToSpriteSheetGridSize = {
    [lagomCardDataUtils.symbolTypes.Relationships]: [4, 5],
  };

  // Tracks all symbols added ever.
  var gSymbolToGlobalSymbolCount = {};

  function configureSymbol(
    symbolNode,
    sectorIndex,
    symbolIndexInSector,
    symbolsThisSector,
    configs
  ) {
    debugLog(
      "configureSymbol",
      "configureSymbol: sectorIndex = " +
        sectorIndex +
        " symbolsThisSector = " +
        symbolsThisSector +
        " symbolIndexInSector = " +
        symbolIndexInSector
    );

    debugLog("configureSymbol", "symbolsThisSector = ", symbolsThisSector);
    debugLog("configureSymbol", "sectorIndex = ", sectorIndex);
    debugLog("configureSymbol", "configs = ", JSON.stringify(configs));

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

  function addNumberForSymbol(symbolNode, symbolIndex, numbersForSymbol) {
    console.assert(symbolIndex < numbersForSymbol.length);
    debugLog(
      "addNumberForSymbol",
      "symbolIndex = ",
      JSON.stringify(symbolIndex)
    );
    debugLog(
      "addNumberForSymbol",
      "numbersForSymbol = ",
      JSON.stringify(numbersForSymbol)
    );
    var number = numbersForSymbol[symbolIndex];
    var numberNode = htmlUtils.addDiv(
      symbolNode,
      ["symbol-number"],
      "symbol-number",
      number.toString()
    );
    return numberNode;
  }

  function addSpriteSheetInfo(symbolNode, symbolType, globalSymbolCount) {
    // Get the sprite info on this symbol type.
    var spriteSheetGridSize = gSymbolToSpriteSheetGridSize[symbolType];
    console.assert(spriteSheetGridSize, "spriteSheetGridSize is null");

    var numColumns = spriteSheetGridSize[0];
    var numRows = spriteSheetGridSize[1];

    var thisColumn = globalSymbolCount % numColumns; // 0..columns-1
    var thisRow = Math.floor(globalSymbolCount / numColumns) % numRows; // 0..rows-1

    // I think of cells like
    // [0, 0], [1, 0], [2, 0]
    // [0, 1], [1, 1], [2, 1
    // etc.
    // For background position w percents, you are sliding the sheet around: to get to the second
    // row slide up (negative) by 1 row height.
    var xPercentPosition = (100 * thisColumn) / (numColumns - 1);
    var yPercentPosition = (100 * thisRow) / (numRows - 1);

    domStyle.set(symbolNode, {
      "background-size": `${numColumns * 100}% ${numRows * 100}%`,
      "background-position": `${xPercentPosition}% ${yPercentPosition}%`,
    });
  }

  function addNSymbols(
    sectorNode, // Node to add symbols too.
    sectorIndex, // Which sector are we talking about.
    symbolType, // Which symbol.
    thisSymbolCount, // How many to add?
    numSymbolsPreviouslyAdded, // How many symbols already added to this sector?
    totalSymbolsInThisSector, // How many total symbols will there be in this sector?
    numbersBySymbolType, // Map from symbol type to numbers to use to config the symbol.
    configs
  ) {
    debugLog("addNSymbols", "sectorIndex = ", JSON.stringify(sectorIndex));
    debugLog("addNSymbols", "symbolType = ", JSON.stringify(symbolType));
    debugLog("addNSymbols", "thisSymbolCount =", thisSymbolCount);
    debugLog(
      "addNSymbols",
      "numSymbolsPreviouslyAdded =",
      numSymbolsPreviouslyAdded
    );
    debugLog(
      "addNSymbols",
      "totalSymbolsInThisSector =",
      totalSymbolsInThisSector
    );
    debugLog(
      "addNSymbols",
      "numbersBySymbolType = ",
      JSON.stringify(numbersBySymbolType)
    );
    debugLog("addNSymbols", "configs = ", JSON.stringify(configs));

    var numbersForSymbol = null;
    if (numbersBySymbolType && numbersBySymbolType[symbolType]) {
      numbersForSymbol = numbersBySymbolType[symbolType];
    }

    for (var i = 0; i < thisSymbolCount; i++) {
      var usesSpriteSheet = gSymbolToSpriteSheetGridSize[symbolType] != null;
      var cssClasses = ["symbol-image", symbolType];

      if (usesSpriteSheet) {
        cssClasses.push("uses-sprite-sheet");
      }
      var globalSymbolCount = gSymbolToGlobalSymbolCount[symbolType] || 0;

      var symbolNode = htmlUtils.addImage(
        sectorNode,
        cssClasses,
        "symbol-image-" + symbolType + "-" + i
      );

      var thisSymbolIndexInSector = numSymbolsPreviouslyAdded + i;

      configureSymbol(
        symbolNode,
        sectorIndex,
        numSymbolsPreviouslyAdded + i,
        totalSymbolsInThisSector,
        configs
      );

      if (numbersForSymbol) {
        addNumberForSymbol(symbolNode, i, numbersForSymbol);
      }

      if (usesSpriteSheet) {
        addSpriteSheetInfo(symbolNode, symbolType, globalSymbolCount);
      }

      // Keep a global count.
      if (!gSymbolToGlobalSymbolCount[symbolType]) {
        gSymbolToGlobalSymbolCount[symbolType] = 0;
      }
      gSymbolToGlobalSymbolCount[symbolType]++;
    }
  }

  function addNthSector(parentNode, sectorIndex, opt_configs) {
    var configs = opt_configs ? opt_configs : {};

    debugLog("addNthSector", "parentNode = ", parentNode);
    debugLog("addNthSector", "sectorIndex = ", sectorIndex);
    debugLog("addNthSector", "configs = ", JSON.stringify(configs));

    var sectorDescriptor = configs.sectorDescriptor
      ? configs.sectorDescriptor
      : {};
    debugLog(
      "addNthSector",
      "sectorDescriptor = ",
      JSON.stringify(sectorDescriptor)
    );

    var sectorMap = sectorDescriptor ? sectorDescriptor.sectorMap : {};

    var totalSymbolsInThisSector = genericUtils.sumHistogram(sectorMap);

    var sectorNode = htmlUtils.addDiv(
      parentNode,
      [
        "sector",
        "symbol-count-" + totalSymbolsInThisSector,
        "sector-index-" + sectorIndex,
      ],
      "sector"
    );

    if (configs.sectorStyling) {
      domStyle.set(sectorNode, configs.sectorStyling);
    }

    if (totalSymbolsInThisSector == 0) {
      // Add the 'rest' symbol.
      var symbolNode = htmlUtils.addImage(
        sectorNode,
        ["symbol-image", "wc-rest"],
        "symbol-image-" + "wc-rest" + "-" + 0
      );
      configureSymbol(symbolNode, sectorIndex, 0, 1, configs);

      return sectorNode;
    }

    var numSymbolsPreviouslyAdded = 0;
    for (var symbolType in sectorMap) {
      var symbolCount = sectorMap[symbolType] || 0;
      if (symbolCount <= 0) {
        continue;
      }

      addNSymbols(
        sectorNode,
        sectorIndex,
        symbolType,
        symbolCount,
        numSymbolsPreviouslyAdded,
        totalSymbolsInThisSector,
        sectorDescriptor.numbersBySymbolType,
        configs
      );
      numSymbolsPreviouslyAdded += symbolCount;
    }
    return sectorNode;
  }

  // This returned object becomes the defined value of this module
  return {
    addNthSector: addNthSector,
  };
});
