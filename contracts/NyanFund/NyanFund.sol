pragma solidity ^0.6.6;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/contracts/token/ERC20/SafeERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/contracts/math/SafeMath.sol";

contract NyanFund {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;
    
    address connectorAddress;
    
    modifier _onlyConnector() {
        require(msg.sender == connectorAddress);
        _;
    }
    
    function approveSpend(address _address, uint256 _amount) public _onlyConnector {
        // ERC20(_address).approve(_address, _amount);
        IERC20 ercToken = IERC20(_address);
        ercToken.safeTransfer(_address, _amount);
    }
}