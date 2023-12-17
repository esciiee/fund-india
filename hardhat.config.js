require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("hardhat-gas-reporter")
require("solidity-coverage")
require("hardhat-deploy")
require("@nomiclabs/hardhat-ethers") // ethers.getContractAt()

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
    solidity: {
        compilers: [
            {version: "0.8.8"},
            {version: "0.6.6"},
        ]
    },
    networks: {
        hardhat: {
            chainId: 31337,
        },
        sepolia: {
            url: process.env.SEPOLIA_RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
            chainId: 11155111,
            blockConfirmations: 6,
        },
        localhost: {
            url: process.env.LOCALHOST_RPC_URL,
            chainId: 1337,
        },
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: true,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        coinmarketcap: process.env.COINMARKETCAP_API_KEY,
        token: "MATIC"
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        user: {
            default: 1,
        }
    }
}