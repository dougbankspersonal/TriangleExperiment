-- When a card leaves the tiling deck, mark it as a tiling card.
function onObjectLeaveContainer(container, object)
  if container.hasTag("tilingDeck") then
    -- This card should not snap.
    print("Card drawn: " .. object.getName())
    print("From deck: " .. container.getName())
    object.addTag("tilingCard")
  end
end

function tryObjectEnterContainer(container, object)
  print("object trying to enter container")
  print("container.getName() = ", container.getName())
  print("object.getName() = ", object.getName())
  -- Tiling cards can never rejoin a deck.
  if object.hasTag("tilingCard") then
    print("Tiling card can't enter deck");
    return false
  end
  return true
end
