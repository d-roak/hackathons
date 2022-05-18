const main = async () => {
    const contractFactory = await hre.ethers.getContractFactory('Copycat');
    const contract = await contractFactory.deploy();
    await contract.deployed();
    console.log("Copycat deployed to %s", contract.address);

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