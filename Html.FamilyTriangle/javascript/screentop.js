export default function (variant, index) {
  var gNumPlayers = 4;
  var gNumCardsPerPlayer = 60;
  var adjustedIndex = index - 1;
  var backAssetIndex = Math.floor(adjustedIndex / gNumCardsPerPlayer) + 1;
  var frontAssetIndex = adjustedIndex + gNumPlayers + 1;
  return {
    frontAssetIndex: frontAssetIndex,
    backAssetIndex: backAssetIndex,
  };
}
