import BigNumber from 'bignumber.js';

export const NetworkBase: { [key: string]: string } = {
  mainnet: 'https://mainnet.meter.io',
  testnet: 'https://test-rpc0.stp.network',
};

export const TapRules: { [key: string]: any } = {
  mainnet: {
    prerequisite: {
      minimalMTRGBalance: new BigNumber(1).times(1e18), // 1 SYSTEM_TOKEN required as balance to enable tap
      maximumMTRBalance: new BigNumber(0),
    },
    tapMTR: {
      enabled: true,
      amount: new BigNumber(3).times(1e17), // 0.3 SYSTEM_COIN each time
    },
    tapMTRG: {
      enabled: false,
      amount: new BigNumber(0).times(1e18),
    },
    checkWhiteList: {
      enabled: true,
    },
  },

  testnet: {
    prerequisite: {
      minimalMTRGBalance: new BigNumber(0), // no minimum required
      maximumMTRBalance: new BigNumber(0),
    },
    tapMTR: {
      enabled: true,
      amount: new BigNumber(2000).times(1e18), // SYSTEM_COIN each tap
    },
    tapMTRG: {
      enabled: true,
      amount: new BigNumber(3000).times(1e18), // SYSTEM_TOKEN each tap
    },
    checkWhiteList: {
      enabled: false,
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
