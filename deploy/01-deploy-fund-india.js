const { network } = require("hardhat")
const { networkConfig, developomentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

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
    const args = [ethUsdPriceFeedAddress]
    const fundIndia = await deploy("FundIndia", {
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: network.config.waitConfirmations || 1,
    })

    log(`FundIndia deployed at ${fundIndia.address}`)
    log("--------------------------------------------")

    if (!developomentChains.includes(network.name)) {
        await verify(fundIndia.address, args)
        log(`Verified contract at ${fundIndia.address}`)
    } 
}

module.exports.tags = ["all", "fundIndia"]
