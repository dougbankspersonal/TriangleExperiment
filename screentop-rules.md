# Acquired Taste

_You gotta taste this!_

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

# Scoring

When the sector counter goes up to or through a multiple of 20, do a round of scoring.

Score each contiguous region of same-colored sectors.

- A player is "dominant" if no other player has more symbols in the region (more than one player can be dominant)
- Each dominant player scores one point for each non-dominant symbol in the region.
- Examples:
  - A region has 3 sushi. Sushi is dominant, but there are no non-dominant symbols. Sushi scores 0.
  - A region has 2 sushi and 2 pizza. Both are dominant. But again there are no non-dominant symbols so neither scores anything.
  - A region has 3 sushi, 2 pizza, and 2 dumpling. Sushi is dominant and scores 4 points, one for each non-dominant symbol.

# Game End

The game ends after the 3rd scoring.
