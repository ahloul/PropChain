import React from 'react';
import { ExternalLink, Wallet, X } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectMetaMask: () => void;
  onDisconnect: () => void;
  address: string | null;
  formattedAddress: string;
  isConnecting: boolean;
  error: string | null;
  isMetaMaskAvailable: boolean;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  onConnectMetaMask,
  onDisconnect,
  address,
  formattedAddress,
  isConnecting,
  error,
  isMetaMaskAvailable,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-gray-100 relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close wallet modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 space-y-6">
          <div>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-[0.2em] mb-2">
              Wallets
            </p>
            <h3 className="text-2xl font-bold text-gray-900">Connect your wallet</h3>
            <p className="text-gray-600 mt-2">
              Choose a wallet to authenticate and manage your blockchain properties.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={onConnectMetaMask}
              disabled={!isMetaMaskAvailable || isConnecting}
              className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                isMetaMaskAvailable
                  ? 'hover:border-blue-400 hover:shadow-md'
                  : 'opacity-70 cursor-not-allowed'
              } ${address ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200 bg-white'}`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-orange-500" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">MetaMask</p>
                  <p className="text-sm text-gray-600">
                    {isMetaMaskAvailable ? 'Browser extension' : 'Not installed'}
                  </p>
                </div>
              </div>
              <span className="text-sm font-medium text-blue-600">
                {isConnecting ? 'Connecting...' : address ? 'Connected' : 'Connect'}
              </span>
            </button>

            {!isMetaMaskAvailable && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <div className="flex items-center justify-between">
                  <p>Please install MetaMask to connect your wallet.</p>
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-amber-900 font-semibold"
                  >
                    <span>Install</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {address && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
              <p className="text-sm text-emerald-700 mb-1">Connected account</p>
              <p className="font-mono text-emerald-800 break-all">{address}</p>
              <div className="mt-3 flex items-center gap-3">
                <span className="text-xs text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md">
                  {formattedAddress}
                </span>
                <button
                  onClick={onDisconnect}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Disconnect
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
