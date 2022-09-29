import { Worker, NearAccount } from 'near-workspaces';
import anyTest, { TestFn } from 'ava';

const test = anyTest as TestFn<{
  worker: Worker;
  accounts: Record<string, NearAccount>;
}>;

test.beforeEach(async (t) => {
  // Init the worker and start a Sandbox server
  const worker = await Worker.init();

  // Deploy contract
  const root = worker.rootAccount;
  const contract = await root.createSubAccount('test-account');

  // Get wasm file path from package.json test script in folder above
  await contract.deploy(process.argv[2]);

  // Save state for test runs, it is unique for each test
  t.context.worker = worker;
  t.context.accounts = { root, contract };
});

test.afterEach(async (t) => {
  // Stop Sandbox server
  await t.context.worker.tearDown().catch((error) => {
    console.log('Failed to stop the Sandbox:', error);
  });
});

test('by default the user has no points', async (t) => {
  const { root, contract } = t.context.accounts;
  const points: number = await contract.view('points_of', { player: root.accountId });
  t.is(points, 0);
});

test('the points are correctly computed', async (t) => {
  const { root, contract } = t.context.accounts;

  let counter: {[key:string]:number} = { 'heads': 0, 'tails': 0 }
  let expected_points = 0;

  for(let i=0; i<10; i++){
    const res = await root.call(contract, 'flip_coin', { 'player_guess': 'heads' })
    counter[res as string] += 1;
    expected_points += res == 'heads' ? 1 : -1;
    expected_points = Math.max(expected_points, 0);
  }

  // A binomial(10, 1/2) has a P(x>2) ~ 0.98%
  t.true(counter['heads'] >= 2);

  const points: number = await contract.view('points_of', { 'player': root.accountId });
  t.is(points, expected_points);
});