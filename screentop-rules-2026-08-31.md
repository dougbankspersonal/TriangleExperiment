# Gerrymander: 2026.09.01

# Terminology

## Players

Each player represents a faction of votes united by their hatred of something:

- Red: clonws
- Yellow: Cats
- Green: Vegetables
- Blue: Education

## Tiles

- Each player has their own deck of tiles.
- A tile is a trianglular playing piece with 4 sectors.
- Each sector is one of four neighborhood types: swamp, city, suburb, or farm.
- City, suburb and farm sectors have a Faction Symbol indicating which faction inhabits the sector: think of it as a voter.
- Swamp sectors do not have Faction Symbols.
- A set of adjacent sectors of the same neighborhood type forms a region of that type.
  - **Adjacent** means they share an edge: corners do not count.

## Resolutions

Resolutions are rules that apply to the people living in the county.

A Resolution has:

- One, two, or three neighborhood types it applies to.
- Symbols indicating how much different factors like the Resolution.
- Flavor text.

# Setup

- Place all Bonus cards face up.
- Place all Resolution cards face up.
- Place neighborhood type, "passed", "failed", and "vote" tokens by the Resolutions.

Each player should collect their:

- Deck of Tiles.
- Resolution Drafting Board.
- Faction Tokens
- Vote/Score Board.

# Player Turn

- Play a tile
- Maybe allocate Faction Tokens.
- Maybe Draft a Resolution.
- Maybe run a Referendum.
- Draw a new Tile.

## Rules for Placement

- New tile must be completely over or under played tiles.
- At least one sector of the new tile must be over or under a sector already played.
- At least one sector of the new tile must be neither over nor under a sector already played.
- If the new tile is over played tiles:
  - A swamp sector can cover any sector.
  - Any sector can cover a swamp sector.
  - Otherwise, the covered sector must match the color and/or Faction Symbol of the covering sector.

## Token Collection and Allocation.

Whenever a new tile causes Faction Symbol to be covered (whether on new or existing tile), for each covered Faction Symbol, that player must immediatgely allocate one Faction Token to a space on their Resolution Drafting Board.

They may not allocate tokens to "Run a Referendum" until there is at least 1 Drafted Resolution in the game.

If more than one player gains Faction Symbol at the same time, the active player allocates all of theirs and then allocation proceeds clockwise.

## Draft a Resolution

As soon as a player has **2** of his Faction Tokens in a "Resolution" region of his Resolution Drafting Board, they must draft a Resolution:

- Select an undrafted Resolution matchnig the filled region of the Resolution Drafting Board.
- Configure it with one or two neighborhood types, if needed, as indicated by the Resultion.
- Place the drafted Resolution next to their Drafting Board: it is now "Drafted".

## Run a Referendum

When a player has **2** of his Faction Tokens in the "Run a Referendum" section of their board, they must run a referendum. The player who triggered the referendum is the Supervisor.

To run a referendum:

- Calculate Votes
- Determine order of Resolutions
- Run Votes on All Resolutions
- Score
- Allocate Bonuses

### Calculate Votes

For each neighborhood:

- Count the sectors in the neighborhood: this is how many votes are at stake.
- Determine which player(s) are **Dominant**. A player is **Dominant** if no player has more faction symbols in the neighborhood.
- The **Dominant** players split the votes for the Neighborhood evenly, rounding up as needed.
- Players collect one Vote token for each earned Vote.

### Determine the order of Resolutions

The Supervisor moves all drafted Resolutions to some central location and orders them, left to right, in the order that they will be voted on.

### Run Votes on All Resolutions

Frmo left to right, the supervisor runs a vote for For each Resolution.

Players secretly select how many Votes they want to cast.
Starting with Supervisor and going clockwise, players reveal votes and whether they are for or against.

If the Resolution passes, add a "Passed" token and move it to some central location with all the other Passed Resolutions.

If it fails, mark it with a "Failed" token and move to a central location with other Failed resolutions.

Spent Vote toekns are returned to the supply.

_VERY IMPORTANT!!!_
Each vote token can only be spent **ONCE** during an election: it can be used on at most one of the Resolutions.

Once all Resolutions are voted on, discard any unused Votes.

## Score

After the Referendum is complete, score each newly passed Resolution.

To score a resolution: for each Faction Symbol that appears on the Resolution:

- Award one point per opposing Faction symbols in neighorhoods matching Resolution neighborhood type(s).
- Note that if a Faction Symbol appears Nx on the Resolution, these points are awarded Nx.

Add this number to the Faction's total score.

## Allocate Bonuses

After Scoring a Referendum, players collect Bonus Cards.

- The Supervisor earns a Bonus card.
- Any failed Resolution earns the drafter a Bonus Card.

Starting with the Supervisor and proceeding clockwise, each player entitled to a Bonus Card may take one Bonus Card.

This may go around several times until everyone has collected all the Bonus cards they are entitied to.

# Game End

At the end of a player's turn, the game ends if:

- 2 Resolutions per player (or more) have been voted on and at least one has passed.
- Any player is out of Tiles.

Highest score wins. In case of a tie, player with fewest Faction symbols on the board wins.
