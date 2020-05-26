import { use, expect } from 'chai';
import { MockProvider, deployContract, solidity } from 'ethereum-waffle';
import { zeroAddress } from 'ethereumjs-util';
import TestToken from '../build/TestToken.json';

use(solidity);

describe('TestToken', () => {
  const [wallet, walletTo] = new MockProvider().getWallets();
  let token: any;

  const initialTotalSupply = 1000;

  beforeEach(async () => {
    token = await deployContract(wallet, TestToken, ['Test Token', 'TT', wallet.address, initialTotalSupply]);
  });

  it('Assigns initial balance', async () => {
    expect(await token.balanceOf(wallet.address)).to.equal(initialTotalSupply);
  });

  it('Transfer adds amount to destination account', async () => {
    const amount = 10;
    await token.transfer(walletTo.address, amount);
    expect(await token.balanceOf(walletTo.address)).to.equal(amount);
  });

  it('Transfer emits event', async () => {
    const amount = 10;
    await expect(token.transfer(walletTo.address, amount))
      .to.emit(token, 'Transfer')
      .withArgs(wallet.address, walletTo.address, amount);
  });

  it('Can not transfer above the amount', async () => {
    const amount = 10;
    await expect(token.transfer(walletTo.address, initialTotalSupply + amount)).to.be.reverted;
  });

  it('Can not transfer from empty account', async () => {
    const tokenFromOtherWallet = token.connect(walletTo);
    await expect(tokenFromOtherWallet.transfer(wallet.address, 1)).to.be.reverted;
  });

  it('Calls totalSupply on TestToken contract', async () => {
    await token.totalSupply();
    expect('totalSupply').to.be.calledOnContract(token);
  });

  it('Calls balanceOf with sender address on TestToken contract', async () => {
    await token.balanceOf(wallet.address);
    expect('balanceOf').to.be.calledOnContractWith(token, [wallet.address]);
  });

  it('Mint adds amount to destination account', async () => {
    const amount = 20;
    await token.mint(wallet.address, amount);
    expect(await token.balanceOf(wallet.address)).to.equal(initialTotalSupply + amount);
  });

  it('Calls totalSupply after mint', async () => {
    const amount = 20;
    await token.mint(wallet.address, amount);
    expect(await token.totalSupply()).to.equal(initialTotalSupply + amount);
  });

  it('Mint emits evnet', async () => {
    const amount = 20;
    const mintAddress = zeroAddress;
    await expect(token.mint(wallet.address, amount))
      .to.emit(token, 'Transfer')
      .withArgs(mintAddress, wallet.address, amount);
  });

  it('Burning the tokens in account', async () => {
    const amount = 20;
    await token.burn(wallet.address, amount);
    expect(await token.balanceOf(wallet.address)).to.equal(initialTotalSupply - amount);
  });

  it('Calls totalSupply after burn', async () => {
    const amount = 20;
    await token.burn(wallet.address, amount);
    expect(await token.totalSupply()).to.equal(initialTotalSupply - amount);
  });

  it('Burn emits events', async () => {
    const amount = 20;
    const burnAddress = zeroAddress;
    await expect(token.burn(wallet.address, amount))
      .to.emit(token, 'Transfer')
      .withArgs(wallet.address, burnAddress, amount);
  });
});
