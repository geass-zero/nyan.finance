pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract NyanToken is ERC20 {
    
    using SafeERC20 for IERC20;
    using SafeMath for uint256;
 
    
    address owner;
    address private fundVotingAddress;
    IERC20 private catnip;
    bool private isSendingFunds;
    uint256 private lastBlockSent;

    modifier _onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    constructor() public payable ERC20("Nyan.finance", "NYAN") {
        owner = msg.sender;
        uint256 supply = 33000;
        _mint(msg.sender, supply.mul(10 ** 18));
        lastBlockSent = block.number;
    }
    
   function setCatnipAddress(address catnipAddress) public _onlyOwner {
       catnip = IERC20(catnipAddress);
   }    
    
   function setFundingAddress(address fundingContract) public _onlyOwner {
       fundVotingAddress = fundingContract;
   }
   
   function startFundingBool() public _onlyOwner {
       isSendingFunds = true;
   }
   
   function getFundingPoolAmount() public view returns(uint256) {
       catnip.balanceOf(owner);
   }
   
   function triggerTransfer(uint256 amount) public {
       require((block.number - lastBlockSent) > 21600, "Too early to transfer");
       catnip.safeTransfer(fundVotingAddress, amount);
   }
    
}