const EmailSystem = artifacts.require("EmailSystem");

module.exports = function(deployer) {
  deployer.deploy(EmailSystem);
};
