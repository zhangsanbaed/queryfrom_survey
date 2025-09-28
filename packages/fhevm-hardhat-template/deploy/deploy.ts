import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployedConfidentialHealthSurvey = await deploy("ConfidentialHealthSurvey", {
    from: deployer,
    log: true,
  });

  console.log(`ConfidentialHealthSurvey contract: `, deployedConfidentialHealthSurvey.address);
};
export default func;
func.id = "deploy_confidentialHealthSurvey"; // id required to prevent reexecution
func.tags = ["ConfidentialHealthSurvey"];
