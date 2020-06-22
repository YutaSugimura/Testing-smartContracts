import { use, expect } from 'chai';
import { MockProvider, deployContract, solidity } from 'ethereum-waffle';
import { BigNumber, utils, Signer } from 'ethers';
import ECDSAMock from '../build/ECDSAMock.json';

use(solidity);

describe('ECDSA', () => {
  const [wallet] = new MockProvider().getWallets();
  let contract: any;

  beforeEach(async () => {
    contract = await deployContract(wallet, ECDSAMock);
  });

  it('toEthSignedMessageHash', async() => {
    const message = 'hello world';
    const bytes = utils.hashMessage(message);
  
    const b = utils.sha256(bytes);

    const sign = await contract.toEthSignedMessageHash(b);

    // const recover = await contract.recover(b, sign);

    const signer = Signer.isSigner('b7fdade05c68a34c5e8be0fcc0e34b25a86c87592845879047eec83c0745f87a');

    console.log({ bytes, sign, signer });
  });
});
