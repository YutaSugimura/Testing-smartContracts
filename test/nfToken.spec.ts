import { use, expect } from 'chai';
import { MockProvider, deployContract, solidity } from 'ethereum-waffle';
import { zeroAddress } from 'ethereumjs-util';
import NFToken from '../build/ERC721Mock.json';

use(solidity);

describe('NFToken', () => {
  const [wallet, walletTo] = new MockProvider().getWallets();
  let token: any;

  const tokenName = 'NFToken';
  const tokenSymbol = 'NFT';

  beforeEach(async () => {
    token = await deployContract(wallet, NFToken, [tokenName, tokenSymbol]);
  });

  it('Contractor Initialization Test', async () => {
    await token.name();
    expect(await token.name()).to.equal(tokenName);
    expect(await token.symbol()).to.equal(tokenSymbol);
  });

  it('Mint Token', async () => {
    const tokenId = 1;
    await token.mint(wallet.address, tokenId);
    expect(await token.balanceOf(wallet.address)).to.equal(1);
    expect(await token.ownerOf(tokenId)).to.equal(wallet.address);
    expect(await token.totalSupply()).to.equal(1);
  });

  it('Mint emits events', async () => {
    const tokenId = 1;
    const mintAddress = zeroAddress;
    await expect(token.mint(wallet.address, tokenId))
      .to.emit(token, 'Transfer')
      .withArgs(mintAddress, wallet.address, tokenId);
  });

  it('Burn Token', async () => {
    const tokenId = 1;

    await token.mint(wallet.address, tokenId);
    await token.burn(tokenId);
    expect(await token.balanceOf(wallet.address)).to.equal(0);
    expect(await token.totalSupply()).to.equal(0);
  });

  it('Burn emits events', async () => {
    const tokenId = 1;
    const burnAddress = zeroAddress;
    await token.mint(wallet.address, tokenId);
    await expect(token.burn(tokenId)).to.emit(token, 'Transfer').withArgs(wallet.address, burnAddress, tokenId);
  });

  it('Transfer', async () => {
    const tokenId = 1;
    await token.mint(wallet.address, tokenId);
    await token.transferFrom(wallet.address, walletTo.address, tokenId);
  });

  it('Transfer emits event', async () => {
    const tokenId = 1;
    await token.mint(wallet.address, tokenId);
    await expect(token.transferFrom(wallet.address, walletTo.address, tokenId))
      .to.emit(token, 'Transfer')
      .withArgs(wallet.address, walletTo.address, tokenId);
  });
});
