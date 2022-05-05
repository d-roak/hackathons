var Article = artifacts.require("./Article.sol");

module.exports = function(deployer) {
  deployer.deploy(Article);
};
