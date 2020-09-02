var NyanToken = artifacts.require("NyanToken.sol");
var CatnipToken = artifacts.require("CatnipToken.sol");

module.exports = async function(deployer) {
    await deployer.deploy(NyanToken)
    await deployer.deploy(CatnipToken)
}