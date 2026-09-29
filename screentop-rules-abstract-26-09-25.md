# Gerrymander: v-ABS-26.09.25

# Terminology

## Players

Each player represents a different Faction in a community.

## Tiles

- Each player has their own deck of tiles.
- A tile is a trianglular playing piece with 4 sectors.

### Sector

- Each sector is one of four types: Swamp (Blue), City (Brick), Farm (Green), or Suburb (Gold).
- City, suburb and farm sectors have a Faction Symbol indicating a Member of the faction living in the sector.
- Swamp sectors do not have Faction Symbols.

### Neighborhoods

- A set of adjacent sectors of the same type forms a neighborhood of that type.
  - **Adjacent** means they share an edge: corners do not count.

# Setup

In some central location:

- Place all Score cards face down: shuffle, place 3 face up.

Each player should collect their:

- Deck of Tiles.
- Displaced Member holder.
- Member Tokens
- "Victory Tokens" Board.

# Player Turn

- Play a tile
- (All Players) Account for Displaced Members
- Resolve Score Cards
- Draw new Tile.

## Play a Tile

Rules for Placement

- New tile must be completely over or under played tiles.
- At least one sector of the new tile must be over or under a sector already played.
- At least one sector of the new tile must be neither over nor under a sector already played.
- If the new tile is over played tiles:
  - A swamp sector can cover any sector.
  - Any sector can cover a swamp sector.
  - Otherwise, the covered sector must match the color and/or Faction Symbol of the covering sector.

## Account for Displaced Members.

Whenever a new tile causes a Faction symbol to be covered (whether on new or existing tile), the owner of the covered symbol must add one token to their "Displaced Members" holder.

## Resolve Score Cards

The Active Player must do the following as long as they have 2 or more Tokens in Displaced Members:

- Remove 2 tokens from Displaced Members.
- Select and resolve one face up Score Card.
- If there are no more face up Score Cards, reveal 3 more.

Resolving a score card will cause some set of Neighborhoods to Score.

### Scoring a Neighborhood

Count the number of sectors in the neighborhood: this is the number of Tokens at stake.

Determine which Faction(s) are **Dominant**. A Faction is **Dominant** if no other Faction has more symbols in the neighborhood.

Dominant Factions split the Tokens for the neighborhood evenly, rounding up.

For each token earned, players take either a token of the matching neighborhood type, or a Swamp token.

It is public info how many token of each type a player has: the symbols on the tokens are private.

#### Example

- A City Neighborhood with 5 Sectors is scored.
- It has 2 Blue, 2 Red, and 1 Yellow Faction Symbol.
- Red and Blue are Dominant.
- They split the Tokens up for grabs (5), rounding up, so each draws 3 tokens: tokens must be City (matching neighbhor type) or Swamp (always available as a fallback choice).
- Red draws 3 City Tokens.
- Blue Draws 1 City and 2 Swamp Tokens.

### Game End

The game is over if at the end of a player's turn, any player has achieved either Victory Condition:

- They have 8 Tokens of each type (8 City, 8 Suburb, 8 Farm, 8 Swamp).
- They have 4 "Perfect Sets" of Tokens. A Perfect is 4 Tokens, all different colors, all same symbol.
  - A single token can be part of at most one Perfect Set.
