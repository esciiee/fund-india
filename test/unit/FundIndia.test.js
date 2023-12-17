const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")
describe("FundIndia", async function () {
    let fundIndia
    let deployer
    let mockV3Aggregator
    let sendValue = "1000000000000000000"
    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture()
        fundIndia = await ethers.getContract("FundIndia", deployer)
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    })
    describe("constructor", async function () {
        it("should set the price feed address", async function () {
            assert.equal(await fundIndia.priceFeed(), mockV3Aggregator.target)
        })
    })
    describe("fund", async function () {
        it("should fail if the price is less than 1000", async function () {
            await expect(fundIndia.fund()).to.be.revertedWith(
                "You need to spend more ETH!"
            )
        })
        it("should update the balance of the contract", async function () {
            await fundIndia.fund({ value: sendValue })
            const res = await fundIndia.addressToAmountFunded(deployer)
            assert.equal(res, sendValue)
        })
        it("should add the sender to the funders array", async function () {
            await fundIndia.fund({ value: sendValue })
            const res = await fundIndia.funders(0)
            assert.equal(res, deployer)
        })
    })
    describe("withdraw", async function () {
        beforeEach(async function () {
            await fundIndia.fund({ value: sendValue })
        })
        it("should Withdarw the ETH from a single funder", async function () {
            //Arrange
            const beforeContractBalance = await ethers.provider.getBalance(
                fundIndia.target
            )
            const beforeDeployerBalance = await ethers.provider.getBalance(
                deployer
            )
            //Act
            const transaction = await fundIndia.withdraw()
            const receipt = await transaction.wait(1)
            const gasCost = receipt.fee
            const afterFundIndiaBalance = await ethers.provider.getBalance(
                fundIndia.target
            )
            const afterDeployerBalance = await ethers.provider.getBalance(
                deployer
            )
            //Assert
            assert.equal(afterFundIndiaBalance.toString(), "0")
            assert.equal(
                (beforeContractBalance + beforeDeployerBalance).toString(),
                (afterDeployerBalance + gasCost).toString()
            )
        })

        it("should withdaw eth from multiple funders", async function () {
            //Arrange
            const accounts = await ethers.getSigners()
            for (let i = 1; i < 6; i++) {
                const contractConnectedAccount = fundIndia.connect(accounts[i])
                await contractConnectedAccount.fund({ value: sendValue })
            }
            const beforefundIndiaBalance = await ethers.provider.getBalance(
                fundIndia.target
            )
            const beforeDeployerBalance = await ethers.provider.getBalance(
                deployer
            )

            //Act
            const transaction = await fundIndia.withdraw()
            const gasCost = (await transaction.wait(1)).fee
            const afterFundIndiaBalance = await ethers.provider.getBalance(
                fundIndia.target
            )
            const afterDeployerBalance = await ethers.provider.getBalance(
                deployer
            )

            //Assert
            assert.equal(afterFundIndiaBalance.toString(), "0")
            assert.equal(
                (beforefundIndiaBalance + beforeDeployerBalance).toString(),
                (afterDeployerBalance + gasCost).toString()
            )

            await expect(fundIndia.funders(0)).to.be.reverted

            for (let i = 1; i < 6; i++) {
                assert.equal(
                    await fundIndia.addressToAmountFunded(accounts[i].address),
                    0
                )
            }
        })

        it("should allow only owner to withdraw the funds", async function () {
            const accounts = await ethers.getSigners()
            const contractConnectedAccount = fundIndia.connect(accounts[1])

            await expect(
                contractConnectedAccount.withdraw()
            ).to.be.revertedWithCustomError(
                contractConnectedAccount,
                "FundIndia_NotOwner"
            )
        })
    })
})
