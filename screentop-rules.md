# Player Turn

Draw and play a tile.

## Rules for Placement

- New tile must be completely over or under played tiles.
- At least one sector of the new tile must be over or under a sector already played.
- At least one sector of the new tile must be neither over nor under a sector already played.
- If the new tile is over played tiles:
  - A blue sector can cover any sector.
  - Any sector can cover a blue sector.
  - Otherwise, the covered sector must match the color or symbol of the covering sector.

## Sector counting

When a new tile is played, update the sector counter to reflect the total number of sectors visible in the play area.

## Scoring

When the sector counter goes up to or through a multiple of 10, do a round of scoring.

Score each contiguous region of same-colored sectors.

- Any symbol which is not outnumbered by any other symbol is "dominant" (if there are ties, more than one symbol can be dominant).
- Dominant symbols score one point for each sector in the contiguous region.
- If a region is has only one symbol, that symbol is "unopposed": unopposed regions score 2 points per sector for the dominant symbol.

## Game End

The game ends after the 4th scoring.
