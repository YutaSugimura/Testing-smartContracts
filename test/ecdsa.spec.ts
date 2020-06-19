import { use, expect } from 'chai';
import { MockProvider, deployContract, solidity } from 'ethereum-waffle';
import { BigNumber, utils } from 'ethers';
import ECDSAMock from '../build/ECDSAMock.json';

use(solidity);

describe('ECDSA', () => {
  const [wallet] = new MockProvider().getWallets();
  let contract: any;

  beforeEach(async () => {
    contract = await deployContract(wallet, ECDSAMock);
  });
});
