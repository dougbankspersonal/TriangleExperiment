# Pyramid of Influence

# Setup

All Players draw a tile from their deck.

# Player Turn

Play a tile, then draw a new tile. Optionally, spend tokens to trigger a round of scoring.

## Rules for Placement

- New tile must be completely over or under played tiles.
- At least one sector of the new tile must be over or under a sector already played.
- At least one sector of the new tile must be neither over nor under a sector already played.
- If the new tile is over played tiles:
  - A blue sector can cover any sector.
  - Any sector can cover a blue sector.
  - Otherwise, the covered sector must match the color or symbol of the covering sector.

## Token Collection and Allocation.

When a tile is played _under_ other tiles, the active player collects one token for each of his symbols on the tile which is covered by the existing tiles.

When a tile is played _over_ other tiles, for each player symbol covered by the new tile, that player collects a token.

When a player collects a token they must immediately place it on one of their active scoring cards.

# Scoring

When tokens are added to a scoring card, check to see if the card is triggered:

- If the player has 3 active scoring cards, a card is triggered by having 4 tokens
- If the player has 2 active scoring cards, a card is triggered by having 6 tokens.
- If the player has 1 active scoring card, a card is triggered by having 8 tokens.

When a scoring card is triggered: remove all tokens, score regions according to the rules on the card, and flip the card: it is not inactive.

## Scoring a region

Determine which player(s) are dominant: a player is dominant if no player has more symbols in the rgion.
Each Dominant player scores one point for every opposing symbol in the region.
Region scores should be kept separate by type: a desert region generates desert points, etc.

# Game End

The game ends when either all players have used all of their scoring cards, or all tiles have been played.

A player's final score is the _lowest_ of the 3 different land type scores.
