const hre = require("hardhat");

async function main() {
  const timestamp = Date.now();
  const date = new Date(timestamp);
  const localTime = date.toLocaleString('id-ID', { 
    timeZone: 'Asia/Makassar',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  console.log('Deployment timestamp:', timestamp, '- Waktu WITA:', localTime);
  
  const ViolenceReport = await hre.ethers.getContractFactory("ViolenceReport");
  const violenceReport = await ViolenceReport.deploy();

  await violenceReport.waitForDeployment();
  
  const deployedTimestamp = Date.now();
  const deployedDate = new Date(deployedTimestamp);
  const deployedLocalTime = deployedDate.toLocaleString('id-ID', {
    timeZone: 'Asia/Makassar',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  console.log('Contract deployed at timestamp:', deployedTimestamp, '- Waktu WITA:', deployedLocalTime);
  
  const address = await violenceReport.getAddress();
  console.log("ViolenceReport deployed to:", address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 