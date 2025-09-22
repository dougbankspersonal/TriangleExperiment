local gTilingDeckTag = "tilingDeck"
local gTilingCardTag = "tilingCard"

-- When a card leaves the tiling deck, mark it as a tiling card.
function onObjectLeaveContainer(container, object)
  if container.hasTag(gTilingDeckTag) then
    -- This card should not snap.
    print("Card drawn: " .. object.getName())
    print("From deck: " .. container.getName())
    object.addTag(gTilingCardTag)
  end
end

-- Do not let tiling cards group with each other.
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

-- Stop card wiggle while being picked up.

local lockedRotByGUID = {}

function isCardNeedingRotationLocking(object)
  return object.hasTag("tilingCard") and object.tag == "Card"
end

function onObjectPickUp(player_color, obj)
  if isCardNeedingRotationLocking(obj) then
    print("Pickup")
    local rotVector = obj.getRotation()
    lockedRotByGUID[obj.getGUID()] = rotVector
    -- snap back immediately (prevents spin)
    obj.setRotation(rotVector)
  end
end

function onObjectDrop(player_color, obj)
  -- Give it a second or two before unlocking.
  Wait.time(function()
    if obj and isCardNeedingRotationLocking(obj) and lockedRotByGUID[obj.getGUID()] then
      print("Drop")
      local originalRot = lockedRotByGUID[obj.getGUID()]
      -- restore saved Y rotation
      obj.setRotationSmooth(originalRot)
      lockedRotByGUID[obj.getGUID()] = nil
    end
  end, 2)
end

function onUpdate()
  for guid, rotVector in pairs(lockedRotByGUID) do
    local obj = getObjectFromGUID(guid)
    if obj then
      obj.setRotation(rotVector)
    else
      lockedRotByGUID[guid] = nil
    end
  end
end
