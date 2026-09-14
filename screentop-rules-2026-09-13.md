# Gerrymander: 2026.09.13

# Terminology

## Players

Each player represents a faction of votes united by love of something:

- Red: clonws
- Yellow: Cats
- Green: Vegetables
- Blue: Education

## Tiles

- Each player has their own deck of tiles.
- A tile is a trianglular playing piece with 4 sectors.
- Each sector is one of four neighborhood types: Swamp (Blue), City (Orange), Farm (Green), or Suburb (Purple).
- City, suburb and farm sectors have a Faction Symbol indicating which faction inhabits the sector: think of it as a voter.
- Swamp sectors do not have Faction Symbols.
- A set of adjacent sectors of the same neighborhood type forms a region of that type.
  - **Adjacent** means they share an edge: corners do not count.

## Resolutions

Resolutions are rules that apply to the people living in the county.

A Resolution has:

- Symbols indicating which Factions benefit from the resolution, and how much.
- Flavor text.

# Setup

In some central location:

- Place all Bonus cards face down: shuffle.
- Place all Resolution cards face up.
- Money Tokens and Passed/Failed tokens.

Each player should collect their:

- Deck of Tiles.
- Resolution Drafting Board.
- Member Tokens
- Money/Score Board.
- Money Bid Board.

# Player Turn

- +3 Active Members
- Play a tile
- Allocate Displaced Member Tokens
- Draft Resolutions
- Run Referendum
- Draw new Tile.

## +3 Active Members

Move 3 of your Member tokens onto the "Active Members" space of your drafting board.

## Play a Tile

Rules for Placement

- New tile must be completely over or under played tiles.
- At least one sector of the new tile must be over or under a sector already played.
- At least one sector of the new tile must be neither over nor under a sector already played.
- If the new tile is over played tiles:
  - A swamp sector can cover any sector.
  - Any sector can cover a swamp sector.
  - Otherwise, the covered sector must match the color and/or Faction Symbol of the covering sector.

## Allocate Displaced Member Tokens

Whenever a new tile causes Faction Symbol to be covered (whether on new or existing tile), for each covered Faction Symbol, that player must immediately move a token from "Active Members" to one of the other slots on the Drafting Board.

If multiple players have to do this at the same time, start with the Active Player and go clockwise.

## Draft a Resolution

If any of the "Draft a Resolution" sections of a player's drafting board has 2 or more tokens in it, they:

- Remove 2 tokens from the space: these are discarded from the game.
- Move a resolution of matching type to the "Drafted" region.
- Resolutions in Drafted region are maintained in a queue: new Resolutions may be inserted anywhere in the queue.

## Run a Referendum

If there are 3 or more Resolutions drafted, that triggers a referendum.

To run a referendum:

- Collect Income
- Run "Auction" on each Resolution, in order.
  - Score newly passed Resolutions
  - Allocate Bonuses
  - Check for game end.
- Cleanup

### Collect Income

For each neighborhood:

- Count the sectors in the neighborhood: this is how many dollars are at stake.
- Determine which player(s) are **Dominant**. A player is **Dominant** if no player has more faction symbols in the neighborhood.
- The **Dominant** players split the dollars for the Neighborhood evenly, rounding up as needed.
- Players collect dollar tokens and store on Money/Score board.

### Run Auction on each Resolution, in order

Players move all Dollars to their Bid Board "Pot" and Hold the Bid Board.

For each Resolution, in queue order, run an auction:

- Players move coins from "Pot" to "Bid", flipped to the their vote on the resolution (for or against).
- Simultaneous reveal.
- If there is a tie, the resolution fails. All bid dollars go back to the Pot.
- Otherwise:
  - Losing side moves money back to Pot.
  - Winning side takes turns moving dollars back from bid to Pot until they win by 1.
  - Remanining winning dollars are spent.
  - Resolution is marked Passed or Failed based on vote outcome.

#### Score newly passed Resolution.

If a Resolution passes, score it immediately: for each Faction on the Resolution:

- Faction Symbols on Resolution \* (#Active Members of every other Faction)

#### Check for Game End

If there are 6 or more resolutions resolved with at least 1 passed:

- Roll a d6.
- Maybe end game based on die result:
  - 6 resolutions resolved: 1 ends game.
  - 7 resolutions: 1-2 ends game.
  - 8 resolutions: 1-4 ends game.
  - 9 Resolutuins: game is over.

### Cleanup

Players discard any unspent Dollars.

### Allocate Bonuses

Any player who drafted a resolution that did not pass may draw one Bonus Card at random.

# Game End

Game ends on:

- Game ending die roll after Resolution Auction (see above)
- A player has no tiles left to play.

Highest score wins.

Tie-breaker:

- Fewest Active Members.
