const { expect } = require("chai");
const { ethers } = require("hardhat");

let copycat;
let owner;
let account1;
let account2;

beforeEach("deploy contract", async () => {
  const accounts = await ethers.getSigners();

  owner = accounts[0];
  account1 = accounts[1];
  account2 = accounts[2];

  const Copycat = await ethers.getContractFactory("Copycat");
  copycat = await Copycat.deploy();
  await copycat.deployed();
});

describe("deposit", function () {
  it("not connected", async function () {
    await copycat.connect(account1).addWalletToCopycat(account2.address);

    const account3 = await ethers.getSigner();
    await expect(
      
      copycat.connect(account1).deposit(account3.address, { value: ethers.utils.parseEther("1") })

    ).to.be.revertedWith("You are not following this wallet");
  });

  it("added addresses", async function () {
    await copycat.connect(account1).addWalletToCopycat(account2.address);
    const account3 = await ethers.getSigner();
    await copycat.connect(account1).addWalletToCopycat(account3.address);
    let result_array = await copycat.connect(account1).getAddressesBeingCopied();

    expect(result_array[0]).to.equal(account2.address);
    expect(result_array[1]).to.equal(account3.address);
  })

  it("add amount", async function () {
    await copycat.connect(account1).addWalletToCopycat(account2.address);
    await copycat.connect(account1).deposit(account2.address, { value: ethers.utils.parseEther("1") })
    let balance = await copycat.connect(account1).balance(account2.address)

    expect(balance).to.equal(ethers.utils.parseEther("1"));
  });
});

describe("deposit fee", function() {

  it("not connected", async function () {
    await copycat.connect(account1).addWalletToCopycat(account2.address);

    const account3 = await ethers.getSigner();
    await expect(
      
      copycat.connect(account1).depositFee(account3.address, { value: 1 })

    ).to.be.revertedWith("You are not following this wallet");
  });

  it("add fee amount", async function () {
    await copycat.connect(account1).addWalletToCopycat(account2.address);
    await copycat.connect(account1).depositFee(account2.address, { value: 1 })
    let balance = await copycat.connect(account1).feeBalance(account2.address)

    expect(balance).to.equal(1);
  });

});

describe("withdraw", function() {

  it("not connected", async function () {
    await copycat.connect(account1).addWalletToCopycat(account2.address);
    await copycat.connect(account1).deposit(account2.address, { value: 2 });

    const account3 = await ethers.getSigner();
    await expect(
      
      copycat.connect(account1).withdraw(1, account3.address)

    ).to.be.revertedWith("You are not following this wallet");
  });

  it("withdraw value", async function () {
    await copycat.connect(account1).addWalletToCopycat(account2.address);
    await copycat.connect(account1).deposit(account2.address, { value: 4 });
    await copycat.connect(account1).withdraw(2, account2.address);

    let balance = await copycat.connect(account1).balance(account2.address)

    expect(balance).to.equal(2);
  });
  
  it("withdraw value excedes balance", async function () {
    await copycat.connect(account1).addWalletToCopycat(account2.address);
    await copycat.connect(account1).deposit(account2.address, { value: 4 });

    await expect(
      
      copycat.connect(account1).withdraw(10, account2.address)

    ).to.be.revertedWith("Amount exceeds balance");
  });

});

describe("withdraw Fee", function() {

  it("not connected", async function () {
    await copycat.connect(account1).addWalletToCopycat(account2.address);
    await copycat.connect(account1).depositFee(account2.address, { value: 2 });

    const account3 = await ethers.getSigner();
    await expect(
      
      copycat.connect(account1).withdrawFee(1, account3.address)

    ).to.be.revertedWith("You are not following this wallet");
  });

  it("withdraw fee value", async function () {
    await copycat.connect(account1).addWalletToCopycat(account2.address);
    await copycat.connect(account1).depositFee(account2.address, { value: 4 });

    let balance1 = await copycat.connect(account1).feeBalance(account2.address)
    expect(balance1).to.equal(4);

    await copycat.connect(account1).withdrawFee(2, account2.address);

    let balance2 = await copycat.connect(account1).feeBalance(account2.address);
    expect(balance2).to.equal(2);
  });

  it("withdraw fee value excedes balance", async function () {
    await copycat.connect(account1).addWalletToCopycat(account2.address);
    await copycat.connect(account1).depositFee(account2.address, { value: 4 });

    await expect(
      
      copycat.connect(account1).withdrawFee(10, account2.address)

    ).to.be.revertedWith("Amount exceeds balance");
  });

});

// falta testar se a tranferência foi bem feita

