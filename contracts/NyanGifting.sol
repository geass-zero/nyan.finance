pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract NyanGifting {
    
    using SafeERC20 for IERC20;
    using SafeMath for uint256;
    
    
    address private nyan = 0xC9cE70A381910D0a90B30d408CC9C7705ee882de;
    IERC20 private nyanToken = IERC20(nyan);
    
    constructor() public payable {
        
    }
    
    function sendGifts(address[] memory _recipients, uint256 _amountPer) public {
        for(uint i = 0; i < _recipients.length; i++) {
            nyanToken.safeTransferFrom(msg.sender, _recipients[i], _amountPer);
        }
    }
    
}