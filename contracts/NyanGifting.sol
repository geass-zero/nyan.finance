pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract NyanGifting {
    
    using SafeERC20 for IERC20;
    using SafeMath for uint256;
    
    
    address private nyan = 0xcBB1677092f3CE3561F5CcAc135Db16652d63451;
    IERC20 private nyanToken = IERC20(nyan);
    
    constructor() public payable {
        
    }
    
    function sendGifts(address[] memory _recipients, uint256 _amountPer) public {
        for(uint i = 0; i < _recipients.length; i++) {
            nyanToken.safeTransferFrom(msg.sender, _recipients[i], _amountPer);
        }
    }
    
}