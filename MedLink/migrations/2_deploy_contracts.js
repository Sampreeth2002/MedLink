const MedicalSystem = artifacts.require("MedicalSystem")

module.exports = function(deployer) {
	deployer.deploy(MedicalSystem)
}
