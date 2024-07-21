import { NearBindgen, near, call, view, UnorderedMap, encode, decode } from 'near-sdk-js';
import { AccountId } from 'near-sdk-js/lib/types';
import * as borsh from 'borsh';

type Side = 'heads' | 'tails'

function simulateCoinFlip(): Side {
  // randomSeed creates a random string, learn more about it in the README
  const randomString: string = near.randomSeed().toString();

  // If the last charCode is even we choose heads, otherwise tails
  return randomString.charCodeAt(0) % 2 ? 'heads' : 'tails';
}


@NearBindgen({
  serializer(value) {
    return borsh.serialize(schema, value);
  },
  deserializer(value) {
    return borsh.deserialize(schema, value);
  },
})
class CoinFlip {
  points: UnorderedMap<number> = new UnorderedMap<number>("points");

  /*
    Flip a coin. Pass in the side (heads or tails) and a random number will be chosen
    indicating whether the flip was heads or tails. If you got it right, you get a point.
  */
  @call({})
  flip_coin({ player_guess }: { player_guess: Side }): Side {
    // Check who called the method
    const player: AccountId = near.predecessorAccountId();
    near.log(`${player} chose ${player_guess}`);

    // Simulate a Coin Flip
    const outcome = simulateCoinFlip();

    // Get the current player points
    let player_points: number = this.points.get(player, { defaultValue: 0, deserializer: donationDeserializer })

    // Check if their guess was right and modify the points accordingly
    if (player_guess == outcome) {
      near.log(`The result was ${outcome}, you get a point!`);
      player_points += 1;
    } else {
      near.log(`The result was ${outcome}, you lost a point`);
      player_points = player_points ? player_points - 1 : 0;
    }

    // Store the new points
    this.points.set(player, player_points, {
      serializer: donationSerializer,
      deserializer: donationDeserializer
    })

    return outcome
  }

  // View how many points a specific player has
  @view({})
  points_of({ player }: { player: AccountId }): number {
    const points = this.points.get(player, {defaultValue: 0, deserializer: donationDeserializer})
    near.log(`Points for ${player}: ${points}`)
    return points
  }
}

const pointSchema: borsh.Schema = 'u32';

function donationSerializer(value) {
  const serialized = borsh.serialize(pointSchema, value).toString();

  return encode(serialized);
}

function donationDeserializer(value) {
  const decoded = decode(value);

  // @ts-expect-error string[] also works
  const bytes = Uint8Array.from(decoded.split(','));

  return borsh.deserialize(pointSchema, bytes);
}

const schema: borsh.Schema = {
  struct: {
    // UnorderedMap
    points: {
      struct: {
        prefix: 'string',
        // Vector
        _keys: {
          struct: {
            prefix: 'string',
            length: 'u32',
          },
        },
        // LookupMap
        values: {
          struct: {
            keyPrefix: 'string',
          },
        },
      },
    },
  },
};