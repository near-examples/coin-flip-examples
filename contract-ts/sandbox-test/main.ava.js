import anyTest from 'ava';
import { readFileSync } from 'fs';
import { Sandbox, DEFAULT_ACCOUNT_ID, DEFAULT_PRIVATE_KEY } from 'near-sandbox';
import { Account, JsonRpcProvider, KeyPair, KeyPairSigner, nearToYocto } from 'near-api-js';

/**
 *  @type {import('ava').TestFn<{sandbox: import('near-sandbox').Sandbox, provider: JsonRpcProvider, root: Account, contract: Account}>}
 */
const test = anyTest;

test.beforeEach(async (t) => {
  // Start a fresh sandbox for each test
  const sandbox = await Sandbox.start({});
  const provider = new JsonRpcProvider({ url: sandbox.rpcUrl });

  // All accounts share the sandbox genesis key for simplicity
  const keyPair = KeyPair.fromString(DEFAULT_PRIVATE_KEY);
  const signer = new KeyPairSigner(keyPair);

  const root = new Account(DEFAULT_ACCOUNT_ID, provider, signer);

  await root.createSubAccount({
    accountOrPrefix: 'contract',
    publicKey: keyPair.getPublicKey(),
    nearToTransfer: nearToYocto('30'),
  });

  const contract = new Account(`contract.${DEFAULT_ACCOUNT_ID}`, provider, signer);

  // Deploy the wasm file passed by the package.json test script
  await contract.deployContract(readFileSync(process.argv[2]));

  // Save state for test runs, it is unique for each test
  t.context = { sandbox, provider, root, contract };
});

test.afterEach.always(async (t) => {
  // Stop the sandbox and clean up temporary files
  await t.context.sandbox.tearDown().catch((error) => {
    console.log('Failed to stop the Sandbox:', error);
  });
});

test('by default the user has no points', async (t) => {
  const { provider, root, contract } = t.context;
  const points = await provider.callFunction({
    contractId: contract.accountId,
    method: 'points_of',
    args: { player: root.accountId },
  });
  t.is(points, 0);
});

test('the points are correctly computed', async (t) => {
  const { provider, root, contract } = t.context;

  const counter = { heads: 0, tails: 0 };
  let expectedPoints = 0;

  for (let i = 0; i < 10; i++) {
    const outcome = await root.callFunction({
      contractId: contract.accountId,
      methodName: 'flip_coin',
      args: { player_guess: 'heads' },
    });
    counter[outcome] += 1;
    expectedPoints += outcome === 'heads' ? 1 : -1;
    expectedPoints = Math.max(expectedPoints, 0);
  }

  // A binomial(10, 1/2) has a P(x>2) ~ 0.98%
  t.true(counter['heads'] >= 2);
  t.true(counter['tails'] >= 2);

  const points = await provider.callFunction({
    contractId: contract.accountId,
    method: 'points_of',
    args: { player: root.accountId },
  });
  t.is(points, expectedPoints);
});
