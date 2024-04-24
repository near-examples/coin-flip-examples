const contractPerNetwork = {
  mainnet: 'hello.near-examples.near',
  testnet: 'coinflip.near-examples.testnet',
};

export const NetworkId = 'testnet';
export const CoinFlipContract = contractPerNetwork[NetworkId];
