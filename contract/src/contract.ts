import { NearBindgen, near, call, view, UnorderedMap } from 'near-sdk-js';

type Side = 'heads' | 'tails'

function simulateCoinFlip(): Side {
  // randomSeed creates a random string, learn more about it in the README
  const randomString: string = near.randomSeed();

  // If the last charCode is even we choose heads, otherwise tails
  return randomString.charCodeAt(0) % 2 ? 'heads' : 'tails';
}


@NearBindgen({})
class CoinFlip {
  points: UnorderedMap = new UnorderedMap("points");

  /*
    Flip a coin. Pass in the side (heads or tails) and a random number will be chosen
    indicating whether the flip was heads or tails. If you got it right, you get a point.
  */ 
  @call({})
  flip_coin({ player_guess }: { player_guess: Side  }): Side {
    // Check who called the method
    const player = near.predecessorAccountId(); 
    near.log(`${player} chose ${player_guess}`);

    // Simulate a Coin Flip
    const outcome = simulateCoinFlip();

    // Get the current player points
    let player_points: number = (this.points.get(player) || 0) as number
    
    // Check if their guess was right and modify the points accordingly
    if(player_guess == outcome) {
      near.log(`The result was ${outcome}, you get a point!`);
      player_points += 1;
    } else {
      near.log(`The result was ${outcome}, you lost a point`);
      player_points = player_points? player_points - 1 : 0;
    }

    // Store the new points
    this.points.set(player, player_points)

    return outcome
  }

  // View how many points a specific player has
  @view({})
  points_of({ player }: { player: string }) : number {
    const points = (this.points.get(player) || 0) as number
    near.log(`Points for ${player}: ${points}`)
    return points
  }
}