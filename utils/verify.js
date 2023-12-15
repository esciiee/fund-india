const { run } = require("hardhat")

const verify = async (contractAddress, args) => {
    console.log("verifying...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.includes("Contract source code already verified")) {
            console.log("Contract source code already verified")
        } else {
            console.log(e)
        }
    }
}

module.exports = {
    verify,
}
