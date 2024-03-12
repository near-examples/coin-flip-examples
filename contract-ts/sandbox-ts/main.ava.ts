import { setDefaultResultOrder } from 'dns'; setDefaultResultOrder('ipv4first'); // temp fix for node > v17

import { Worker, NearAccount } from 'near-workspaces';
import anyTest, { TestFn } from 'ava';
import * as path from 'path';

// Global context
let worker: Worker;
let accounts: Record<string, NearAccount>;

const test = anyTest as TestFn<{}>;

test.before(async (t) => {
  // Init the worker and start a Sandbox server
  worker = await Worker.init();

  // Deploy contract
  const root = worker.rootAccount;

  // Get wasm file path from package.json test script in folder above
  const contract = await root.createSubAccount('contract');
  await contract.deploy(process.argv[2]);

  // Save state for test runs, it is unique for each test
  accounts = { root, contract };
});

test.after.always(async (t) => {
  // Stop Sandbox server
  await worker.tearDown().catch((error) => {
    console.log('Failed to stop the Sandbox:', error);
  });
});

test('by default the user has no points', async (t) => {
  const { root, contract } = accounts;
  const points: number = await contract.view('points_of', { player: root.accountId });
  t.is(points, 0);
});

test('the points are correctly computed', async (t) => {
  const { root, contract } = accounts;

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