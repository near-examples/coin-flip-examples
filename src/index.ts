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
        /*
          Fill this in
        */
    }

    // View how many points a specific player has
    @view
    viewPoints({ player }: { player: string }) {
        /*
          Fill this in
        */
    }
}