const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const { expect } = require("chai");

const TokenModule = require("../ignition/modules/TokenModule");
const { ethers } = require("hardhat");

describe("Token Contract", function () {

  async function deployCounterModuleFixture() {
    const {token} = await ignition.deploy(TokenModule, {
      parameters: {
        TokenModule: {
          tokenName: process.env.MEME_TOKEN_NAME,
          tokenSymbol: process.env.MEME_TOKEN_SYMBOL,
          initialSupply: process.env.MEME_TOKEN_TOTAL_SUPPLY,
        }
      }
    });
    const [owner, addr1, addr2, _] = await ethers.getSigners();
    return {token, owner, addr1, addr2, _};
  }

  it("Should have correct initial supply allocations", async function () {
    const {token, owner} = await loadFixture(deployCounterModuleFixture);

    console.log("token address is ", await token.getAddress());

    const initialSupply = ethers.parseUnits(process.env.MEME_TOKEN_TOTAL_SUPPLY, 18);

    expect(await token.balanceOf(owner.address)).to.equal(initialSupply);
  });

  it("Should allow owner to freeze and unfreeze accounts", async function () {
    const {token, addr1, addr2} = await loadFixture(deployCounterModuleFixture);

    await token.setFrozenAccount(addr1.address, true);
    expect(await token.frozenAccount(addr1.address)).to.be.true;

    await token.setFrozenAccount(addr1.address, false);
    expect(await token.frozenAccount(addr1.address)).to.be.false;
  });

  it("Should allow owner to lock and unlock accounts", async function () {
    const {token, addr1, addr2} = await loadFixture(deployCounterModuleFixture);

    const unlockTime = Math.floor(Date.now() / 1000) + 60; // 1 minute from now
    await token.lockAccount(addr1.address, unlockTime);
    expect(await token.isAccountLocked(addr1.address)).to.be.true;

    await token.unlockAccount(addr1.address);
    expect(await token.isAccountLocked(addr1.address)).to.be.false;
  });

  it("Should transfer 20 tokens from addr1 to onwer", async function () {
    const {token, owner, addr1, addr2} = await loadFixture(deployCounterModuleFixture);

    // addr1 transfers 20 tokens to addr2
    const transferAmount = ethers.parseUnits("20", 18);
    await token.connect(owner).transfer(addr1.address, transferAmount);

    // Check balances
    const addr1Balance = await token.balanceOf(addr1.address);

    expect(addr1Balance).to.equal(transferAmount);
  });

  it("Should prevent transfers from frozen accounts", async function () {
    const {token, owner, addr1, addr2} = await loadFixture(deployCounterModuleFixture);

    console.log("addr1 address is ", owner.address);
    console.log("addr1 balance is ", await token.balanceOf(owner.address));

    await token.setFrozenAccount(owner.address, true);

    // await token.connect(addr1).transfer(addr2.address, ethers.parseUnits("20", 18));
    await expect(token.connect(owner).transfer(addr1.address, ethers.parseUnits("100", 18))).to.be.revertedWithCustomError(token, "ERC20InvalidSender");
  });

  it("Should prevent transfers from locked accounts", async function () {
    const {token, owner, addr1, addr2} = await loadFixture(deployCounterModuleFixture);

    const unlockTime = Math.floor(Date.now() / 1000) + 60; // 1 minute from now
    await token.lockAccount(owner.address, unlockTime);
    await expect(token.connect(owner).transfer(addr1.address, ethers.parseUnits("100", 18))).to.be.revertedWithCustomError(token, "ERC20InvalidSender");
  });
});
