# Coin Flip Contract

The smart contract implements a flip coin game in which the player tries to guess the next outcome.
The player gets a point on each correct guess, and losses one for each wrong one.

```ts
function simulateCoinFlip(): Side {
  const randomString: string = near.randomSeed();
  return randomString.charCodeAt(0) % 2 ? 'heads' : 'tails';
}

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
```

<br />

# Quickstart

1. Make sure you have installed [node.js](https://nodejs.org/en/download/package-manager/) >= 16.
2. Install the [`NEAR CLI`](https://github.com/near/near-cli#setup)

<br />

## 1. Build and Test the Contract
You can automatically compile and test the contract in the NEAR testnet by running:

```bash
npm run test
```

<br />

## 2. Create Account and Deploy the Contract
You can create a new account and deploy the contract on it by running:

```bash
near create-account <your-account>.testnet --useFaucet
near deploy <your-account>.testnet build/contract.wasm
```

<br />

## 3. Get the Score
`points_of` performs read-only operations, therefore it is a `view` method.

`View` methods can be called for **free** by anyone, even people **without a NEAR account**!

```bash
# Use near-cli to get the points
near view <your-account> points_of '{"player": "<dev-account>"}'
```

<br />

## 4. Flip a Coin and Try to Guess the Outcome
`flip_coin` takes a guess ("heads" or "tails"), simulates a coin flip and gives/removes points to the player.

It changes the contract's state, for which it is a `call` method.

`Call` methods can only be invoked using a NEAR account, since the account needs to pay GAS for the transaction.

```bash
# Use near-cli to play
near call <your-account> flip_coin '{"player_guess":"tails"}' --accountId <your-account>
```

**Tip:** If you would like to call `flip_coin` using another account, first login into NEAR using:

```bash
# Use near-cli to login your NEAR account
near login
```

and then use the logged account to sign the transaction: `--accountId <another-account>`.

## A Note on Random Numbers
Generating random numbers in an adversarial environment such as a blockchain is very difficult. This spawns from
the fact that everything is public on the network.

Please check our documentation to learn more about handling [random numbers in a blockchain](https://docs.near.org/develop/contracts/security/storage).