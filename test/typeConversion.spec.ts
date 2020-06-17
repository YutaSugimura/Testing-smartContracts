import { use, expect } from 'chai';
import { MockProvider, deployContract, solidity } from 'ethereum-waffle';
import TypeConversion from '../build/CheckTypeConversion.json';

use(solidity);

describe('Test', () => {
  const [wallet] = new MockProvider().getWallets();
  let contract: any;

  beforeEach(async () => {
    contract = await deployContract(wallet, TypeConversion);
  });

  it('lib uint256 => string', async () => {
    expect(await contract.fromUint256(10)).to.equal('10');
  });
});
