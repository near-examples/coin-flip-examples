type ContractPerNetwork = {
  [key: string]: string;
};

const contractPerNetwork: ContractPerNetwork = {
  testnet: "coinflip.near-examples.testnet",
};

export const NetworkId: "testnet" = "testnet";
export const CoinFlipContract: string = contractPerNetwork[NetworkId];

type EVMChain = {
  chainId: number;
  name: string;
  explorer: string;
  rpc: string;
};

type EVMChains = {
  [key: string]: EVMChain;
};

const evmWalletChains: EVMChains = {
  mainnet: {
    chainId: 397,
    name: "Near Mainnet",
    explorer: "https://eth-explorer.near.org",
    rpc: "https://eth-rpc.mainnet.near.org",
  },
  testnet: {
    chainId: 398,
    name: "Near Testnet",
    explorer: "https://eth-explorer-testnet.near.org",
    rpc: "https://eth-rpc.testnet.near.org",
  },
};

export const EVMWalletChain: EVMChain = evmWalletChains[NetworkId];
