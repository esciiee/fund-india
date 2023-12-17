const { developomentChains } = require("../../helper-hardhat-config")
const { ethers, network, getNamedAccounts } = require("hardhat")
const { expect, assert } = require("chai")

!developomentChains.includes(network.name)
    ? describe("FundIndia", async function () {
          let fundIndia
          let deployer
          const sendValue = "100000000000000000"
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              fundIndia = await ethers.getContract("FundIndia", deployer)
          })

          it("should allow people to fund and owner to withraw", async function () {
              const sendTransaction = await fundIndia.fund({ value: sendValue })
              await sendTransaction.wait(1)
              const withdawTransaction = await fundIndia.withdraw()
              await withdawTransaction.wait(1)

              const balance = await ethers.provider.getBalance(fundIndia.target)
              assert.equal(balance.toString(), "0")
          })
      })
    : describe.skip("These tests are only for local testing")
