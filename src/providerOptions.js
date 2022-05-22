import WalletConnect from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import { ethers } from 'ethers';

export const providerOptions = {
  walletlink: {
    package: CoinbaseWalletSDK, // Required
    options: {
      appName: 'deCrowd', // Required
      rpc: process.env.REACT_APP_MUMBAI_RPC_URL,
      chainId: ethers.utils.hexValue(80001),
    },
  },
};
