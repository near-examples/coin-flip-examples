import {NearContract, NearBindgen, call, view, near} from 'near-sdk-js'

function generateRandomNumber(): boolean {
  // Get random string and check what the the character code is at the first index
  let randomString = near.randomSeed(); 
  // Random between 0 and 65535? I think???
  let randomNumber = randomString.charCodeAt(0);

  if(randomNumber > 95) {
      near.log(`Random number (${randomNumber}) greater than 95. Returning 1`)
      return true
  } else {
      near.log(`Random number (${randomNumber}) less than or equal to 95. Returning 0`)
      return false;
  }
}

@NearBindgen
class CoinFlip extends NearContract {
    points: {}
    
    constructor() {
        //execute the NEAR Contract's constructor
        super()
        //set default values for the points
        this.points = {}
    }

    /*
        Flip a coin. Pass in the side (heads or tails) and a random number will be chosen
        indicating whether the flip was heads or tails. If you got it right, you get a point.
    */
    @call
    flipCoin({ side }: { side: string }) {
        // Get the current player and ensure they're in the game state
        let player = near.predecessorAccountId();
        if(!this.points.hasOwnProperty(player)) {
          this.points[player] = 0;
        }

        near.log(`${player} chose ${side}`);

        // Cross contract call to the random number hub to get a random number between 0 and 1 (inclusive) as an integer
        const randomNum = generateRandomNumber();

        // Let's set heads to be 0 and tails to be 1
        let outcome = randomNum == false ? "heads" : "tails";

        // Check if the result was what the player passed in
        if(side == outcome) {
            near.log(`You Get a Point! The result was ${outcome}`);
            this.points[player] += 1;
        } else {
            near.log(`You lost a point... The result was ${outcome}`);
            this.points[player] = this.points[player] == 0 ? 0 : this.points[player] - 1;
        }
    }

    // View how many points a specific player has
    @view
    viewPoints({ player }: { player: string }) {
        if(this.points.hasOwnProperty(player)) {
          near.log(`Points for ${player}: ${this.points[player]}`);
          return this.points[player];
        }

        near.log(`Points for ${player}: N/A`);
        return null;
    }
}