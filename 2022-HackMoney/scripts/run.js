const main = async () => {
    const contractFactory = await hre.ethers.getContractFactory("Copycat");
    const contract = await contractFactory.deploy();
    await contract.deployed();
    console.log("Contract address:", contract.address);


    let contractBalance = await hre.ethers.provider.getBalance(
        contract.address
    );
    console.log(
        "Contract balance:",
        hre.ethers.utils.formatEther(contractBalance)
    );

    contractBalance = await hre.ethers.provider.getBalance(contract.address);
    console.log(
        "Contract balance:",
        hre.ethers.utils.formatEther(contractBalance)
    );

};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};