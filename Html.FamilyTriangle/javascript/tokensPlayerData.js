define([
  "sharedJavascript/debugLog",
  "sharedJavascript/htmlUtils",
  "javascript/gameInfo",
  "dojo/domReady!",
], function (debugLogModule, htmlUtils, gameInfo) {
  var debugLog = debugLogModule.debugLog;

  var gTokenDiceConfigs = null;

  function getPlayerTokensConfig() {
    var dieConfig = {};
    dieConfig.classes = ["tokens", "player"];

    var faceConfigs = [];

    for (var i = 0; i < gameInfo.numPlayers; i++) {
      var faceConfig = {
        classes: ["token", "player-" + i],
        imageClasses: ["player-icon-" + i],
      };
      faceConfigs.push(faceConfig);
    }

    dieConfig.faces = faceConfigs;
    return dieConfig;
  }

  function generateTokenDiceConfigs() {
    if (gTokenDiceConfigs !== null) {
      return gTokenDiceConfigs;
    }

    gTokenDiceConfigs = [];
    var playerTokenDieConfig = getPlayerTokensConfig();
    gTokenDiceConfigs.push(playerTokenDieConfig);

    return gTokenDiceConfigs;
  }

  function getTokenDiceConfigs() {
    generateTokenDiceConfigs();
    return gTokenDiceConfigs;
  }

  return {
    getTokenDiceConfigs: getTokenDiceConfigs,
  };
});
