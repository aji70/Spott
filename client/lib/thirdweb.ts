import { createThirdwebClient } from "thirdweb";
import { defineChain } from "thirdweb/chains";

// Replace with your actual client ID from thirdweb dashboard
export const client = createThirdwebClient({
  clientId: process.env.EXPO_PUBLIC_THIRDWEB_CLIENT_ID || "your-client-id-here",
});

// Citrea Testnet configuration
export const citreaTestnet = defineChain({
  id: 5115,
  name: "Citrea Testnet",
  nativeCurrency: {
    name: "Citrea Bitcoin",
    symbol: "cBTC",
    decimals: 18,
  },
  rpc: "https://rpc.testnet.citrea.xyz",
  blockExplorers: [
    {
      name: "Citrea Explorer",
      url: "https://explorer.testnet.citrea.xyz",
    },
  ],
  testnet: true,
});
