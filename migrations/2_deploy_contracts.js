const RawMaterial = artifacts.require("RawMaterial");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(RawMaterial);
};
