var Purchasing = artifacts.require("Purchasing.sol");
var JAMMint = artifacts.require("JAMMint.sol");

module.exports = function(deployer){
	deployer.deploy(JAMMint);
	deployer.deploy(Purchasing,"0x4B9c926a2D28ea7F7F914379749C638f4ca222f6",1);
							 
};
