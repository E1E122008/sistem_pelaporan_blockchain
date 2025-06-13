const hre = require("hardhat");

async function main() {
  const ViolenceReport = await hre.ethers.getContractFactory("ViolenceReport");
  const violenceReport = await ViolenceReport.deploy();

  await violenceReport.waitForDeployment();

  const address = await violenceReport.getAddress();
  console.log("ViolenceReport deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 