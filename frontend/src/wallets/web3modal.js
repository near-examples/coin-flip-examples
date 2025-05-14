import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { createAppKit } from "@reown/appkit/react";
import { nearTestnet } from "@reown/appkit/networks";
import { reconnect } from "@wagmi/core";

// Get your projectId at https://cloud.reown.com
const projectId = '5bb0fe33763b3bea40b8d69e4269b4ae';

// Modal for login
export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [nearTestnet],
});

export const web3Modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [nearTestnet],
  enableWalletConnect: true,
  features: {
    analytics: true,
    swaps: false,
    onramp: false,
    email: false, // Smart accounts (Safe contract) not available on NEAR Protocol, only EOA.
    socials: false, // Smart accounts (Safe contract) not available on NEAR Protocol, only EOA.
  },
  coinbasePreference: "eoaOnly", // Smart accounts (Safe contract) not available on NEAR Protocol, only EOA.
  allWallets: "SHOW",
});

// force reconnecting if the user has already signed in with an ethereum wallet
// this is a workaround until `ethereum-wallets` supports the `reconnect` method
if (typeof window !== "undefined") {
  const recentWallets = localStorage.getItem("near-wallet-selector:recentlySignedInWallets");
  recentWallets && recentWallets.includes("ethereum-wallets") && reconnect(wagmiAdapter.wagmiConfig)
} 