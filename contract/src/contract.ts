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
    // implement the flip_coin method
  }

  // View how many points a specific player has
  @view({})
  points_of({ player }: { player: string }) : number {
    // implement the points_of
  }
}