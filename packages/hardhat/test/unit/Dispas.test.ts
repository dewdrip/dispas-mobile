import { expect } from "chai";
import { ethers } from "hardhat";
import { Dispas, Dispas__factory } from "../typechain-types";
import { Signer } from "ethers";

describe("Dispas", function () {
  let dispas: Dispas;
  let deployer: Signer, addr1: Signer, addr2: Signer, addr3: Signer;
  let deployerAddress: string, addr1Address: string, addr2Address: string, addr3Address: string;

  before(async () => {
    [deployer, addr1, addr2, addr3] = await ethers.getSigners();
    deployerAddress = await deployer.getAddress();
    addr1Address = await addr1.getAddress();
    addr2Address = await addr2.getAddress();
    addr3Address = await addr3.getAddress();

    // Deploy Dispas contract
    const DispasFactory = (await ethers.getContractFactory("Dispas")) as Dispas__factory;
    dispas = await DispasFactory.deploy();
    await dispas.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(dispas.target).to.not.be.undefined;
    });
  });

  describe("Fund Distribution", function () {
    it("Should distribute funds to multiple recipients correctly", async function () {
      const amount1 = ethers.parseEther("1"); // 1 ETH
      const amount2 = ethers.parseEther("0.5"); // 0.5 ETH
      const amount3 = ethers.parseEther("0.25"); // 0.25 ETH

      const totalAmount = amount1 + amount2 + amount3;

      const payments = [
        { recipient: addr1Address, amount: amount1 },
        { recipient: addr2Address, amount: amount2 },
        { recipient: addr3Address, amount: amount3 },
      ];

      // Get initial balances
      const addr1BalBefore = await ethers.provider.getBalance(addr1Address);
      const addr2BalBefore = await ethers.provider.getBalance(addr2Address);
      const addr3BalBefore = await ethers.provider.getBalance(addr3Address);

      // Execute the transaction
      await expect(dispas.distributeFunds(payments, { value: totalAmount }))
        .to.emit(dispas, "FundsDistributed")
        .withArgs(deployerAddress, totalAmount);

      // Get final balances
      const addr1BalAfter = await ethers.provider.getBalance(addr1Address);
      const addr2BalAfter = await ethers.provider.getBalance(addr2Address);
      const addr3BalAfter = await ethers.provider.getBalance(addr3Address);

      // Ensure recipient balances increased by the correct amounts
      expect(addr1BalAfter).to.equal(addr1BalBefore + amount1);
      expect(addr2BalAfter).to.equal(addr2BalBefore + amount2);
      expect(addr3BalAfter).to.equal(addr3BalBefore + amount3);
    });

    it("Should revert if recipient address is zero", async function () {
      const amount = ethers.parseEther("1");

      const invalidPayments = [{ recipient: ethers.ZeroAddress, amount }];

      await expect(dispas.distributeFunds(invalidPayments, { value: amount })).to.be.revertedWithCustomError(
        dispas,
        "Dispas__ZeroAddress",
      );
    });

    it("Should revert if any amount is zero", async function () {
      const invalidPayments = [{ recipient: addr1Address, amount: 0 }];

      await expect(dispas.distributeFunds(invalidPayments, { value: 0 })).to.be.revertedWithCustomError(
        dispas,
        "Dispas__ZeroAmount",
      );
    });

    it("Should revert if sent ETH does not match total distribution amount", async function () {
      const amount1 = ethers.parseEther("1");
      const amount2 = ethers.parseEther("1");
      const totalAmount = amount1 + amount2;

      const payments = [
        { recipient: addr1Address, amount: amount1 },
        { recipient: addr2Address, amount: amount2 },
      ];

      await expect(
        dispas.distributeFunds(payments, { value: totalAmount - ethers.parseEther("0.5") }),
      ).to.be.revertedWithCustomError(dispas, "Dispas__InsufficientValue");
    });
  });

  describe("Fallback Function", function () {
    it("Should revert on direct ETH transfers", async function () {
      await expect(deployer.sendTransaction({ to: dispas.target, value: ethers.parseEther("1") })).to.be.revertedWith(
        "Direct deposits not allowed",
      );
    });
  });
});
