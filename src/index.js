import {NearContract, NearBindgen, call, view, near} from 'near-sdk-js'
import { Random } from "random-js";

@NearBindgen
class CoinFlip extends NearContract {
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
    flipCoin(side) {
        // Get the current player and ensure they're in the game state
        let player = near.predecessorAccountId();
        if(!(player in this.points)) {
            this.points[player] = 0;
        }

        env.log(`${player} chose ${side}`);

        // CCC

        let random = new Random();
        const value = random.integer(1, 100);
        env.log(`value was ${value}`);

        // Get the result of the coin flip
        let result; 
        let num = Math.floor(Math.random() * 2);
        env.log(`Num was ${num}`);
        let even = num == 0;
        env.log(`Even was ${even}`);
        if (even) {
            result = "heads";
        } else {
            result = "tails";
        }

        // Check if the result was what the player passed in
        if(result == side) {
            env.log(`You Get a Point! The result was ${result}`);
            this.points[player] += 1;
        } else {
            env.log(`You lost a point... The result was ${result}`);
            this.points[player] -= 1;
        }
    }

    // View how many points a specific player has
    @view
    viewPoints(player) {
        return this.points[player];
    }
}