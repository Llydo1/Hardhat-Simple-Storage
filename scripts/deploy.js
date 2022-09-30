//import
const { ethers, run, network } = require("hardhat");
const open = require("open");
const readline = require("readline");
require("dotenv").config();
const url = process.env.URL_GOERLI;

// @dev Declrare array of contract methods
const contractChoice = [
  "store new favorite number",
  "get favorite number",
  "add people",
  "get person",
];

// @dev Declare user Input
// @param query - text that appears before input
function getInput(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

// @dev Open transaction on explorer after response
// @param resp - should be a transaction.
async function openTransactionOnExplorer(resp) {
  console.log("1 confirmations");
  console.log(resp.transactionHash);
  if ((await getInput("Open trasaction on explore?(y)")) == "y")
    await open(`${url}tx/${resp.transactionHash}`);
}

// @dev Contract operating - use to control the method of contract
// @param userChoice - choice from user input
// @param contract - the current contract
async function contractOperating(userChoice, contract) {
  switch (userChoice) {
    case "0":
      await contract
        .store(getInput("Input number to store on contract:"))
        .then(async (resp) => {
          console.log(
            "Successfully invoked transaction, wait for confirmation"
          );
          return resp.wait(1);
        })
        .then(async (resp) => openTransactionOnExplorer(resp))
        .catch((err) => console.log(err));
      break;

    case "1":
      console.log(
        `The favorite number of contract ${contract.address}:  ` +
          (await contract.retrieve()).toString()
      );
      break;

    case "2":
      const name = await getInput("Input name of person: ");
      const favoriteNumber = await getInput(
        `Input ${name}'s favorite number: `
      );
      await contract
        .addPeople(name, favoriteNumber)
        .then((resp) => {
          console.log(
            "Successfully invoked transaction, wait for confirmation"
          );
          return resp.wait(1);
        })
        .then(async (resp) => openTransactionOnExplorer(resp))
        .catch((err) => console.log(err));
      break;

    case "3":
      console.log(
        (
          await contract.people(getInput("Input index to get person: "))
        ).toString()
      );
      break;

    case "x":
      break;

    default:
      console.log("wrong input, try again. To exit, press x");
      break;
  }
}

// main
// The main function for deploying
async function main() {
  // Deploying contract
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("deploying contract...");
  const simpleStorage = await SimpleStorageFactory.deploy();
  await simpleStorage.deployed();

  // Verify contract if it is on Testnet/Mainnet
  if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    await simpleStorage.deployTransaction.wait(2);
    await verify(simpleStorage.address, []);
  }

  // Operating with contract
  let userChoice = 0;
  while (userChoice != "x") {
    try {
      contractChoice.map((choice, index) => {
        console.log(index + ". " + choice);
      });
      userChoice = await getInput("Choose what to do with your contract:");
      await contractOperating(userChoice, simpleStorage);
    } catch (error) {
      console.log("please try again");
      console.log("To exit, press x");
    }
  }
}

// Verify programmically
async function verify(contractAddress, args) {
  console.log("Verifying contract....");
  await run("verify:verify", {
    address: contractAddress,
    constructorArguments: args,
  })
    .then(async () => {
      console.log(`Verification complete. Navigate to etherscan `);
    })
    .catch((e) => {
      if (e.message.toLowerCase().includes("already verified"))
        console.log("Already verified");
      else console.log(e);
    })
    // Navitate to the transaction hash on the browser
    .finally(async () => await open(`${url}address/${contractAddress}#code`));
}

// Main execute
main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
