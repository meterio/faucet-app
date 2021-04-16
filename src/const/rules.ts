import BigNumber from 'bignumber.js';

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
      amount: new BigNumber(1).times(1e17), // 0.1 MTR each time
    },
    tapMTRG: {
      enabled: false,
      amount: new BigNumber(0).times(1e18),
    },
  },

  testnet: {
    prerequisite: {
      minimalMTRGBalance: new BigNumber(0), // no minimum required
    },
    tapMTR: {
      enabled: true,
      amount: new BigNumber(2000).times(1e18), // MTR each tap
    },
    tapMTRG: {
      enabled: true,
      amount: new BigNumber(3000).times(1e18), // MTRG each tap
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
