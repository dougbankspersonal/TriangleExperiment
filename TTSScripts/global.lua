-- When a tiling card leaves the deck of tiling cards, turn snapping off for the card.
function onObjectLeaveContainer(container, object)
  if container.hasTag("tilingDeck") then
    -- This card should not snap.
    print("Card drawn: " .. object.getName())
    print("From deck: " .. container.getName())
    object.setSnapPoints({})
  end
end
