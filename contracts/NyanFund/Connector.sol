contract WidgetInterface {

   function doSomething() public returns(uint) {}
   function somethingElse() public returns(bool isTrue) {}
   function testMethod3(uint256 amount) public returns (uint256) {}

}



pragma solidity ^0.6.6;
pragma experimental ABIEncoderV2;

import "./ERC20Interface.sol";
import "./UniswapV2Interface.sol";
import "./WETHInterface.sol";
import "./YearnInterface.sol";

contract Connector {
    
    WidgetInterface w;
    uint256 public testNum = 1;
    
    struct bid {
        address bidder;
        uint256 votes;
        address[] addresses;
        uint256[] integers;
        string[] strings;
        bytes32[] bytesArr;
    }
    
    function setTestInterface(address _addr) public {
        w = WidgetInterface(_addr);
    }
    
    // Only voting contract should be able to call
    function executeBid(string memory functionCode, string memory functionName, address[] memory _addresses, uint256[] memory integers, string[] memory strings, bytes32[] memory bytesArr) public returns (address addr) {
        
        
        if (keccak256(bytes(functionCode)) == keccak256(bytes("test"))) {
            interfaceTest(functionCode,functionName,_addresses,integers,strings,bytesArr);
        }
        if (keccak256(bytes(functionCode)) == keccak256(bytes("erc20"))) {
            interfaceERC20(functionCode,functionName,_addresses,integers,strings,bytesArr);
        }
        if (keccak256(bytes(functionCode)) == keccak256(bytes("uniV2"))) {
            interfaceUniV2(functionCode,functionName,_addresses,integers,strings,bytesArr);
        }
        if (keccak256(bytes(functionCode)) == keccak256(bytes("weth"))) {
            interfaceWETH(functionCode,functionName,_addresses,integers,strings,bytesArr);
        }
        if (keccak256(bytes(functionCode)) == keccak256(bytes("yearn"))) {
            interfaceUniV2(functionCode,functionName,_addresses,integers,strings,bytesArr);
        }
    }
    
    function interfaceTest(string memory functionCode, string memory functionName, address[] memory _addresses, uint256[] memory integers, string[] memory strings, bytes32[] memory bytesArr) internal {
        if (keccak256(bytes(functionName)) == keccak256(bytes("method3"))) {
           w.testMethod3(integers[0]); 
        }
    }
    
    //ERC20 CONNECTION
    function interfaceERC20(string memory functionCode, string memory functionName, address[] memory _addresses, uint256[] memory integers, string[] memory strings, bytes32[] memory bytesArr) internal {
        ERC20 erc20 = ERC20(_addresses[0]);
        if (keccak256(bytes(functionName)) == keccak256(bytes("totalSupply"))) {
           erc20.totalSupply();
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("balanceOf"))) {
           erc20.balanceOf(_addresses[1]);
           
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("transfer"))) {
            erc20.transfer(_addresses[1], integers[0]);
           
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("allowance"))) {
           erc20.allowance(_addresses[1], _addresses[2]);
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("approve"))) {
           erc20.approve(_addresses[1], integers[0]);
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("transferFrom"))) {
           erc20.transferFrom(_addresses[1], _addresses[2], integers[0]);
        }
    }
    
    //UNISWAP V2 CONNECTION
    function interfaceUniV2(string memory functionCode, string memory functionName, address[] memory _addresses, uint256[] memory integers, string[] memory strings, bytes32[] memory bytesArr) internal {
        //Does CALLEE need an address?
        if (keccak256(bytes(functionName)) == keccak256(bytes("uniswapV2Call"))) {
           
        }
        
        //IUniswapV2ERC20 functions
        
        //IUniswapV2Factory functions
        if (keccak256(bytes(functionName)) == keccak256(bytes("feeTo"))) {
            IUniswapV2Factory uniV2Factory = IUniswapV2Factory(_addresses[0]);
            uniV2Factory.feeTo();
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("feeToSetter"))) {
            IUniswapV2Factory uniV2Factory = IUniswapV2Factory(_addresses[0]);
            uniV2Factory.feeToSetter();
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("getPair"))) {
            IUniswapV2Factory uniV2Factory = IUniswapV2Factory(_addresses[0]);
            uniV2Factory.getPair(_addresses[1], _addresses[2]);
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("allPairs"))) {
            IUniswapV2Factory uniV2Factory = IUniswapV2Factory(_addresses[0]);
            uniV2Factory.allPairs(integers[0]);
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("allPairsLength"))) {
            IUniswapV2Factory uniV2Factory = IUniswapV2Factory(_addresses[0]);
            uniV2Factory.allPairsLength();
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("createPair"))) {
            IUniswapV2Factory uniV2Factory = IUniswapV2Factory(_addresses[0]);
            uniV2Factory.createPair(_addresses[1], _addresses[2]);
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("setFeeTo"))) {
            IUniswapV2Factory uniV2Factory = IUniswapV2Factory(_addresses[0]);
            uniV2Factory.setFeeTo(_addresses[1]);
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("setFeeToSetter"))) {
            IUniswapV2Factory uniV2Factory = IUniswapV2Factory(_addresses[0]);
            uniV2Factory.setFeeToSetter(_addresses[1]);
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("setFeeToSetter"))) {
            IUniswapV2Factory uniV2Factory = IUniswapV2Factory(_addresses[0]);
            uniV2Factory.setFeeToSetter(_addresses[1]);
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("setFeeToSetter"))) {
            IUniswapV2Factory uniV2Factory = IUniswapV2Factory(_addresses[0]);
            uniV2Factory.setFeeToSetter(_addresses[1]);
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("setFeeToSetter"))) {
            IUniswapV2Factory uniV2Factory = IUniswapV2Factory(_addresses[0]);
            uniV2Factory.setFeeToSetter(_addresses[1]);
        }
        
        //IUniswapV2Pair functions
    }
    
    //WETH CONNECTION
    //Need all the WETH funtions
     function interfaceWETH(string memory functionCode, string memory functionName, address[] memory _addresses, uint256[] memory integers, string[] memory strings, bytes32[] memory bytesArr) internal {
         if (keccak256(bytes(functionName)) == keccak256(bytes("wethDeposit"))) {
            WETH wethAddr = WETH(_addresses[0]);
            wethAddr.deposit();
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("wethWithdraw"))) {
            WETH wethAddr = WETH(_addresses[0]);
            wethAddr.withdraw(integers[0]);
        }
     }
    
    //YEARN CONNECTION
    function interfaceYearn(string memory functionCode, string memory functionName, address[] memory _addresses, uint256[] memory integers, string[] memory strings, bytes32[] memory bytesArr) internal {
        if (keccak256(bytes(functionName)) == keccak256(bytes("cConvert"))) {
            YConverter convertAddr = YConverter(_addresses[0]);
            convertAddr.convert(_addresses[1]);
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("yicWithdraw"))) {
            YearnIController iController = YearnIController(_addresses[0]);
            iController.withdraw(_addresses[1], integers[0]);
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("yicBalanceOf"))) {
            YearnIController iController = YearnIController(_addresses[0]);
            iController.balanceOf(_addresses[1]);
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("yicEarn"))) {
            YearnIController iController = YearnIController(_addresses[0]);
            iController.earn(_addresses[1], integers[0]);
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("yicWant"))) {
            YearnIController iController = YearnIController(_addresses[0]);
            iController.want(_addresses[1]);
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("yicRewards"))) {
            YearnIController iController = YearnIController(_addresses[0]);
            iController.rewards();
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("yicVaults"))) {
            YearnIController iController = YearnIController(_addresses[0]);
            iController.vaults(_addresses[1]);
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("ymMint"))) {
            YMintr mintr = YMintr(_addresses[0]);
            mintr.mint(_addresses[1]);
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("yosaSwap"))) {
            YOneSplitAudit oneSplitAudit = YOneSplitAudit(_addresses[0]);
            // Needs to accept uint arrays
            // oneSplitAudit.swap(_addresses[1], _addresses[2], integers[0], integers[1], integers[3], integers[4]);
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("yosaGetExpectedReturn"))) {
            YOneSplitAudit oneSplitAudit = YOneSplitAudit(_addresses[0]);
            // Needs to accept uint arrays
            oneSplitAudit.getExpectedReturn(_addresses[1], _addresses[2], integers[0], integers[1], integers[3]);
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("yStratWant"))) {
            YearnStrategy yStrategy = YearnStrategy(_addresses[0]);
            yStrategy.want();
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("yStratDeposit"))) {
            YearnStrategy yStrategy = YearnStrategy(_addresses[0]);
            yStrategy.deposit();
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("yStratWithdraw"))) {
            YearnStrategy yStrategy = YearnStrategy(_addresses[0]);
            yStrategy.withdraw(_addresses[1]);
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("yStratWithdraw1"))) {
            YearnStrategy yStrategy = YearnStrategy(_addresses[0]);
            yStrategy.withdraw(integers[0]);
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("yStratWithdrawAll"))) {
            YearnStrategy yStrategy = YearnStrategy(_addresses[0]);
            yStrategy.withdrawAll();
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("yStratBalanceOf"))) {
            YearnStrategy yStrategy = YearnStrategy(_addresses[0]);
            yStrategy.balanceOf();
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("yERCDeposit"))) {
            YearnERC20 yERC = YearnERC20(_addresses[0]);
            yERC.deposit(integers[0]);
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("yERCWithdraw"))) {
            YearnERC20 yERC = YearnERC20(_addresses[0]);
            yERC.withdraw(integers[0]);
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("yERCPricePerFullShare"))) {
            YearnERC20 yERC = YearnERC20(_addresses[0]);
            yERC.getPricePerFullShare();
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("yVaultsDeposit"))) {
            YearnVault yVaults = YearnVault(_addresses[0]);
            yVaults.deposit(integers[0]);
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("yVaultsDepositAll"))) {
            YearnVault yVaults = YearnVault(_addresses[0]);
            yVaults.depositAll();
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("yVaultsWithdraw"))) {
            YearnVault yVaults = YearnVault(_addresses[0]);
            yVaults.withdraw(integers[0]);
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("yVaultsWithdrawAll"))) {
            YearnVault yVaults = YearnVault(_addresses[0]);
            yVaults.withdrawAll();
        }
        if (keccak256(bytes(functionName)) == keccak256(bytes("yVaultsPricePerFullShare"))) {
            YearnVault yVaults = YearnVault(_addresses[0]);
            yVaults.getPricePerFullShare();
        }
    }
}