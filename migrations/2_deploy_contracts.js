const MedCycle = artifacts.require("MedCycle");
const Admin = artifacts.require("Admin");
const Supplier = artifacts.require("Supplier");
const Transporter = artifacts.require("Transporter");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(Admin);

  const admin = await Admin.deployed();

  console.log(admin.address);
  await deployer.deploy(Supplier, admin.address);
  await deployer.deploy(Transporter, admin.address);
  await deployer.deploy(MedCycle, admin.address);
};
