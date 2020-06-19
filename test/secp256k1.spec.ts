import { use, expect } from 'chai';
import { MockProvider, deployContract, solidity } from 'ethereum-waffle';
import { BigNumber, utils } from 'ethers';
import Secp256k1 from '../build/Secp256k1.json';

use(solidity);

describe('Secp256k1', () => {
  const [wallet] = new MockProvider().getWallets();
  let contract: any;

  beforeEach(async () => {
    contract = await deployContract(wallet, Secp256k1);
  });

  it('On the line.', async () => {
    const point = await contract.derivePubKey(wallet.privateKey);

    const p = 2 ** 256 - 2 ** 32 - 2 ** 9 - 2 ** 8 - 2 ** 7 - 2 ** 6 - 2 ** 4 - 1;
    expect((point[0] ** 3 + 7 - point[1] ** 2) % p).to.equal(0);
  });

  it('PublicKey', async () => {
    const point = await contract.derivePubKey(wallet.privateKey);

    const _x = BigNumber.from(point[0])._hex;
    const _y = BigNumber.from(point[1])._hex;
    const x = _x.slice(2);
    const y = _y.slice(2);

    expect('0x' + '04' + String(x) + String(y)).to.equal(wallet.publicKey);
  });

  it('Ethereum address', async () => {
    const point = await contract.derivePubKey(wallet.privateKey);

    const _x = BigNumber.from(point[0])._hex;
    const _y = BigNumber.from(point[1])._hex;
    const x = _x.slice(2);
    const y = _y.slice(2);

    const _publickKey = '0x' + String(x) + String(y);
    const publickKey = BigNumber.from(_publickKey);
    const keccak256 = utils.keccak256(BigNumber.from(publickKey)._hex);
    const _address = keccak256.slice(26);
    const address = utils.getAddress('0x' + _address);
    expect(address).to.equal(wallet.address);
  });
});
