const { network } = require("hardhat")
const {
    DECIMALS,
    INITIAL_ANSWER,
    developomentChains
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    if (developomentChains.includes(network.name)) {
        log("Running Mock Deployments...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        })
        log("Mock Deployments Deployed!")
        log("--------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
