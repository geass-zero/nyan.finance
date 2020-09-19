pragma solidity ^0.6.6;
pragma experimental ABIEncoderV2;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/contracts/token/ERC20/SafeERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/contracts/math/SafeMath.sol";
import "./ERC20Interface.sol";

contract NyanVoting {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;
    
    address public owner;
    
    uint256 public currentVotingStartBlock;
    uint256 public currentVotingEndBlock;
    bool public isVotingPeriod;
    
    uint256 public votingPeriodBlockLength = 270;
    uint256 public costPerVote = 1000000000000000000;
    uint256 public catnipCost = 100000000000000000;
    
    struct bid {
        address bidder;
        string functionCode;
        string functionName;
        uint256 votes;
        address[] addresses;
        uint256[] integers;
        string[] strings;
        bytes32[] bytesArr;
        string[] chain;
    }
    
     mapping(address => bid) private currentBids;
    
    struct bidChain {
        string id;
        string functionCode;
        string functionName;
        address[] addresses;
        uint256[] integers;
        string[] strings;
        bytes32[] bytesArr;
    }
    
    mapping(string => bidChain) private bidChains;
    
    address public topBidAddress;
    
    struct votingHold {
        uint256 nyanLocked;
        uint256 releaseBlock;
    }
    
    mapping(address => votingHold) private votedNyan;
    
    
    uint256 public lastDistributionBlock;
    uint256 public currentDistributionEndBlock;
    bool public isDistributing;
    bool public canDistribute;
    bool public isRewardingCatnip = true;
    
    
    address public currentDistributionAddress;
    uint256 public currentDistributionAmount;
    uint256 public currentDistributionAmountClaimed;
    
    struct distributionClaimed {
        uint256 nyanLocked;
        
    }
    
    mapping(address => distributionClaimed) private claims;
    
    
    address public nyanAddress;
    IERC20 private nyanIERC20;
    address public catnipAddress;
    IERC20 private catnipIERC20;
    address public catnipUni;
    IERC20 private catnipUniIERC20;
    address public dNyanAddress;
    IERC20 private dNyanIERC20;
    
    address public uniswapAddress;
    
    address public connectorAddress;
    
    modifier _onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    modifier _onlyConnector() {
        require(msg.sender == connectorAddress);
        _;
    }
    
    
    constructor() public {
        owner = address(this);
        currentVotingStartBlock = block.number;
        currentVotingEndBlock = block.number + votingPeriodBlockLength;
    }
    
    function setConnector(address _connector) public _onlyConnector {
        connectorAddress = _connector;
        
        //Voting connector change event
    }
    
    function setIsRewardingCatnip(bool _isRewarding) public _onlyConnector {
        isRewardingCatnip = _isRewarding;
        
        //Voting connector change event
    }
    
    function setVotingPeriodBlockLength(uint256 _blocks) public _onlyConnector {
        votingPeriodBlockLength = _blocks;
        
        //Voting period change event
    } 
    
    function setNyanAddress(address _addr) public _onlyConnector {
        nyanAddress = _addr;
        nyanIERC20 = IERC20(nyanAddress);
        
        //Nyan address change event
    }
    
    function setCatnipAddress(address _addr) public _onlyConnector {
        catnipAddress = _addr;
        catnipIERC20 = IERC20(catnipAddress);
        
        //Catnip address change event
    }
    
    function setdNyanAddress(address _addr) public _onlyConnector {
        dNyanAddress = _addr;
        dNyanIERC20 = IERC20(dNyanAddress);
        
        //dNyan address change event
    }
    
    function proposeBid(string memory _functionCode, string memory _functionName, address[] memory _addresses, uint256[] memory _integers, string[] memory _strings, bytes32[] memory _bytesArr) public {
        require(isVotingPeriod, "Voting period has not started.");
        require(currentVotingEndBlock >= block.number, "Voting period has ended.");
        currentBids[msg.sender].bidder = msg.sender;
        currentBids[msg.sender].functionCode = _functionCode;
        currentBids[msg.sender].functionName = _functionName;
        currentBids[msg.sender].addresses = _addresses;
        currentBids[msg.sender].integers = _integers;
        currentBids[msg.sender].strings = _strings;
        currentBids[msg.sender].bytesArr = _bytesArr;
        
        //Bid proposal event
    }
    
    function addChainBid(string memory id, string memory _functionCode, string memory _functionName, address[] memory _addresses, uint256[] memory _integers, string[] memory _strings, bytes32[] memory _bytesArr) public {
        
    }
    
    function voteForBid(address _bidAddr, uint256 votes) public {
        nyanIERC20.safeTransferFrom(msg.sender, address(this), votes * costPerVote);
        catnipIERC20.safeTransferFrom(msg.sender, address(this), votes * catnipCost);
        votedNyan[msg.sender].nyanLocked = votedNyan[msg.sender].nyanLocked.add(votes * costPerVote);
        votedNyan[msg.sender].releaseBlock = currentVotingEndBlock;
        currentBids[_bidAddr].votes = currentBids[_bidAddr].votes.add(votes);
        
        //Bid vote event
        
    }
    
    function withdrawBidNyan() public {
        require(votedNyan[msg.sender].releaseBlock > block.number, "Nyan is still locked for vote");
        uint256 amount = votedNyan[msg.sender].nyanLocked;
        nyanIERC20.safeTransfer(msg.sender, amount);
        votedNyan[msg.sender].nyanLocked = 0;
        
        //Bid Nyan withdrawal event
    }
    
    function approveContract(address _addr, uint256 _amount) public _onlyConnector {
        ERC20(_addr).approve(_addr, _amount);
        
        //Contract approval event
    }
    
    function executeBid(string memory _functionCode, 
                        string memory _functionName, 
                        address[] memory _addresses, 
                        uint256[] memory integers, 
                        string[] memory strings, 
                        bytes32[] memory bytesArr)
                        public _onlyConnector {
                            
        // require(currentVotingEndBlock < block.number, "Voting period is still active.");
        currentVotingStartBlock = block.number.add(votingPeriodBlockLength.mul(2));
        currentVotingEndBlock = block.number.add(currentVotingStartBlock.add(votingPeriodBlockLength));
        connectorAddress.call(abi.encodeWithSignature("executeBid(string,string,address[],uint256[],string[],bytes32[])",
                                                        _functionCode,_functionName,_addresses,integers,strings,bytesArr));
                                                        
        
        for (uint256 c = 0; c<currentBids[topBidAddress].chain.length; c++) {
            connectorAddress.call(abi.encodeWithSignature("executeBid(string,string,address[],uint256[],string[],bytes32[])",
                                                        bidChains[currentBids[topBidAddress].chain[c]].functionCode,
                                                        bidChains[currentBids[topBidAddress].chain[c]].functionName,
                                                        bidChains[currentBids[topBidAddress].chain[c]].addresses,
                                                        bidChains[currentBids[topBidAddress].chain[c]].integers,
                                                        bidChains[currentBids[topBidAddress].chain[c]].strings,
                                                        bidChains[currentBids[topBidAddress].chain[c]].bytesArr));
        }
        
        //Bid execution event                                                
    }
    
    function distributeFunds(address _addr, uint256 _amount) public _onlyConnector {
        
    }
    
    function claimDistribution(address _claimer, uint256 _amount) public {
        require(isDistributing && currentVotingEndBlock>block.number, "You are not in a distribution period");
        nyanIERC20.safeTransferFrom(_claimer, address(this), _amount);
        claims[_claimer].nyanLocked = claims[_claimer].nyanLocked.add(_amount);
        uint256 nyanSupply = ERC20(nyanAddress).totalSupply();
        uint256 catnipSupply = ERC20(catnipUni).totalSupply();
        uint256 rewardsPool = nyanSupply;
        
        if (isRewardingCatnip) {
            rewardsPool.add(catnipSupply);
        }
        
        uint256 claimerPerc = rewardsPool.mul(_amount);
        uint256 claimedAmount = currentDistributionAmount.div(claimerPerc);
        IERC20(currentDistributionAddress).safeTransfer(msg.sender, _amount);
        currentDistributionAmountClaimed = currentDistributionAmountClaimed.add(claimedAmount);
        
        //distribution claim event
        
    }
    
    function withdrawDistributionNyan() public {
        
    }
    
    function burnCatnip() public _onlyConnector {
        //take catnip in burn pool
        //divide the amount in half
        //swap one half for dNyan on uniswap
        //send other catnip half to burn address
        //send swapped dNyan to burn address
        
    }
    
    
    
}