import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type EthereumRequest = {
  method: string;
  params?: unknown[] | Record<string, unknown>;
};

type EthereumProvider = {
  isMetaMask?: boolean;
  request: (args: EthereumRequest) => Promise<unknown>;
  on?: (eventName: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (eventName: string, handler: (...args: unknown[]) => void) => void;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

interface WalletContextValue {
  address: string | null;
  isConnecting: boolean;
  error: string | null;
  isMetaMaskAvailable: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  clearError: () => void;
  formattedAddress: string;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export const WalletProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMetaMaskAvailable = Boolean(typeof window !== 'undefined' && window.ethereum);

  const formattedAddress = useMemo(() => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  const clearError = () => setError(null);

  const connectWallet = async () => {
    clearError();

    if (!window.ethereum) {
      setError('MetaMask not detected. Please install it to continue.');
      return;
    }

    try {
      setIsConnecting(true);
      const accounts = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[] | undefined;

      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
      } else {
        setError('No accounts returned from provider.');
      }
    } catch (err) {
      const errorMessage =
        (err as { code?: number; message?: string })?.code === 4001
          ? 'Connection request was rejected.'
          : (err as { message?: string })?.message || 'Failed to connect wallet.';
      setError(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setError(null);
  };

  useEffect(() => {
    const provider = window.ethereum;
    if (!provider?.on) return;

    const handleAccountsChanged = (accounts: unknown) => {
      if (Array.isArray(accounts) && accounts.length > 0 && typeof accounts[0] === 'string') {
        setAddress(accounts[0]);
      } else {
        setAddress(null);
      }
    };

    provider.on('accountsChanged', handleAccountsChanged);

    return () => {
      provider.removeListener?.('accountsChanged', handleAccountsChanged);
    };
  }, []);

  const value: WalletContextValue = {
    address,
    isConnecting,
    error,
    isMetaMaskAvailable,
    connectWallet,
    disconnectWallet,
    clearError,
    formattedAddress,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
