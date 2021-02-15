import BigNumber from 'bignumber.js';
import { Network } from './network';

export const NetworkBase: { [key: string]: string } = {
  mainnet: 'https://mainnet.meter.io',
  testnet: 'https://warringstakes.meter.io',
};

export const TapRules: { [key: string]: any } = {
  mainnet: {
    prerequisite: {
      minimalMTRGBalance: new BigNumber(1).times(1e18), // 1 MTRG required as balance to enable tap
    },
    tapMTR: {
      enabled: true,
      amount: new BigNumber(1).times(1e18), // 1 MTR each time
    },
    tapMTRG: {
      enabled: false,
      amount: new BigNumber(1).times(1e18),
    },
  },

  testnet: {
    prerequisite: {
      minimalMTRGBalance: new BigNumber(0), // no minimum required
    },
    tapMTR: {
      enabled: true,
      amount: new BigNumber(10).times(1e18), // 10 MTR each time
    },
    tapMTRG: {
      enabled: true,
      amount: new BigNumber(400).times(1e18), // 400 MTRG each time
    },
  },
};

export const getTapRules = (network: string | undefined): any => {
  if (!network) return undefined;
  if (network.toLowerCase() in TapRules) {
    return TapRules[network.toLowerCase()];
  }
  return undefined;
};

export const getNetworkBase = (
  network: string | undefined
): string | undefined => {
  if (!network) return undefined;
  if (network.toLowerCase() in NetworkBase) {
    return NetworkBase[network.toLowerCase()];
  }
  return undefined;
};
