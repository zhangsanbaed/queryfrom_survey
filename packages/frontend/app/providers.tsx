"use client";

import type { ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { MetaMaskProvider } from "@/hooks/metamask/useMetaMaskProvider";
import { InMemoryStorageProvider } from "@/hooks/useInMemoryStorage";
import { MetaMaskEthersSignerProvider } from "@/hooks/metamask/useMetaMaskEthersSigner";

type Props = {
  children: ReactNode;
};

const config = createConfig({
  chains: [
    {
      id: 31337,
      name: "Hardhat",
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      rpcUrls: {
        default: { http: ["http://localhost:8545"] },
      },
    },
  ],
  connectors: [injected()],
  transports: {
    [31337]: http("http://localhost:8545"),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: Props) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <MetaMaskProvider>
          <MetaMaskEthersSignerProvider initialMockChains={{ 31337: "http://localhost:8545" }}>
            <InMemoryStorageProvider>{children}</InMemoryStorageProvider>
          </MetaMaskEthersSignerProvider>
        </MetaMaskProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
