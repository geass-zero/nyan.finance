var NyanToken = artifacts.require("NyanToken.sol");
var CatnipToken = artifacts.require("CatnipToken.sol");

module.exports = async function(deployer) {
    await deployer.deploy(NyanToken, { gas: 7000000 })
    await deployer.deploy(CatnipToken, { gas: 7000000 })
}