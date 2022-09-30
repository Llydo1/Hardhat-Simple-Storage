const { assert } = require("chai");
const { ethers } = require("hardhat");

// @title Testing for the simple storage
describe("SimpleStorage", () => {
  // Declare contractFactory and contract
  let simpleStorageFactory, simpleStorage;

  // Assign contractFactory and contract
  beforeEach(async () => {
    simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await simpleStorageFactory.deploy();
  });

  // Test for the current favoriteNumber after contract is deployed
  // Should start with 0
  it("Should start with 0", async () => {
    const currentValue = await simpleStorage.retrieve();
    const expectedValue = "0";
    assert.equal(currentValue, expectedValue);
  });

  // Test for the favoriteNumber after call store
  // Should update with 7
  it("Should update with 7 when call store", async () => {
    await (await simpleStorage.store(7)).wait(1);
    const currentValue = await simpleStorage.retrieve();
    const expectedValue = "7";
    assert.equal(currentValue.toString(), expectedValue);
  });

  // Test for the first People of people array after call store addPeople("quan", 19)
  it("Should update people with name Quan and favoriteNumber 5", async () => {
    await (await simpleStorage.addPeople("quan", 19)).wait(1);
    const { favoriteNumber, name } = await simpleStorage.people(0);
    const expectedName = "quan";
    const expectedNumber = "19";
    assert.equal(name, expectedName);
    assert.equal(favoriteNumber.toString(), expectedNumber);
  });
});
