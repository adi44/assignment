const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("MessageStorage", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployMessageStorageFixture() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const MessageStorage = await ethers.getContractFactory("MessageStorage");
    const messageStorage = await MessageStorage.deploy("Hello, world!");

    return { messageStorage, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      const { messageStorage, owner, otherAccount } = await loadFixture(deployMessageStorageFixture);

      expect(await messageStorage.message() == "Hello World!");
    });

    it("Should set the right owner", async function () {
      const { messageStorage, owner } = await loadFixture(deployMessageStorageFixture);

      expect(await messageStorage.owner()).to.equal(owner.address);
    });

    it("Owner should be able to change the message", async function () {
      const { messageStorage, owner } = await loadFixture(deployMessageStorageFixture);

      await messageStorage.setMessage("Hello, world 2!");
      expect(await messageStorage.message()).to.equal("Hello, world 2!");
    });
    it("Other accounts should not be able to change the message", async function () {
      const { messageStorage, otherAccount } = await loadFixture(deployMessageStorageFixture);

      await expect(messageStorage.connect(otherAccount).setMessage("Hello, world 2!")).to.be.reverted;
    });
  });
  });