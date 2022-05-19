const main = async () => {
    let contractFactory = await hre.ethers.getContractFactory('Copycat');
    let contract = await contractFactory.deploy();
    await contract.deployed();
    console.log("Copycat deployed to %s", contract.address);

    contractFactory = await hre.ethers.getContractFactory('CopycatAAVE');
    contract = await contractFactory.deploy();
    await contract.deployed();
    console.log("CopycatAAVE deployed to %s", contract.address);

}

const runMain = async () => {
    try {
        await main();
        process.exit(0)
    } catch (error) {
        console.log(error);
        process.exit(1);
    }

}

runMain()