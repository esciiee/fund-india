const { network } = require("hardhat")
const { networkConfig, developomentChains } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let ethUsdPriceFeedAddress
    if(developomentChains.includes(network.name)){
        log("Running on Development")
        ethUsdPriceFeedAddress = (await deployments.get("MockV3Aggregator")).address
    } else {
        log("Running on Testnet")
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    const fundIndia = await deploy("FundIndia", {
        from: deployer,
        log: true,
        args: [ethUsdPriceFeedAddress],
    })
    log(`FundIndia deployed at ${fundIndia.address}`)
    log("--------------------------------------------")
}

module.exports.tags = ["all", "fundIndia"]
