import anyTest from 'ava';
import { Worker } from 'near-workspaces';
import { setDefaultResultOrder } from 'dns'; setDefaultResultOrder('ipv4first'); // temp fix for node >v17

/**
 *  @typedef {import('near-workspaces').NearAccount} NearAccount
 *  @type {import('ava').TestFn<{worker: Worker, accounts: Record<string, NearAccount>}>}
 */
const test = anyTest;
test.beforeEach(async (t) => {
  // Create sandbox, accounts, deploy contracts, etc.
  const worker = t.context.worker = await Worker.init();

  // Deploy contract
  const root = worker.rootAccount;

  // Get wasm file path from package.json test script in folder above
  const contract = await root.createSubAccount('contract');
  await contract.deploy(process.argv[2]);

  // Save state for test runs, it is unique for each test
  t.context.accounts = { root, contract };
});

test.afterEach.always(async (t) => {
  // Stop Sandbox server
  await t.context.worker.tearDown().catch((error) => {
    console.log('Failed to stop the Sandbox:', error);
  });
});

test('by default the user has no points', async (t) => {
  const { root, contract } = t.context.accounts;
  const points = await contract.view('points_of', { player: root.accountId });
  t.is(points, 0);
});

test('the points are correctly computed', async (t) => {
  const { root, contract } = t.context.accounts;

  let counter = { 'heads': 0, 'tails': 0 }
  let expected_points = 0;

  for(let i=0; i<10; i++){
    const res = await root.call(contract, 'flip_coin', { 'player_guess': 'heads' })
    counter[res] += 1;
    expected_points += res == 'heads' ? 1 : -1;
    expected_points = Math.max(expected_points, 0);
  }

  // A binomial(10, 1/2) has a P(x>2) ~ 0.98%
  t.true(counter['heads'] >= 2);
  t.true(counter['tails'] >= 2);

  const points = await contract.view('points_of', { 'player': root.accountId });
  t.is(points, expected_points);
});