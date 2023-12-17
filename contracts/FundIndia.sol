// SPDX-License-Identifier: MIT
//Pragmas
pragma solidity ^0.8.8;

// Imports
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

//Errors
error FundIndia_NotOwner();

//Interfaces

//Libraries

//Contract


/**@title A Contract to fund India.
 * @author Suraj Choudhary
  *@notice This contract is used to fund India.
  *@dev This contract uses prices feeds from Chainlink to convert ETH to USD.
*/
contract FundIndia {
    // Type Declarations
    using PriceConverter for uint256;

    // State Variables
    //append all store variables with s_
    //append all immutable variables with i_
    //write constant variables in all caps

    AggregatorV3Interface public s_priceFeed;

    mapping(address => uint256) public s_addressToAmountFunded;
    address[] public s_funders;

    // Could we make this constant?  /* hint: no! We should make it immutable! */
    address public immutable i_owner;
    uint256 public constant MINIMUM_USD = 50 * 10 ** 18;

    modifier onlyOwner {
        // require(msg.sender == owner);
        if (msg.sender != i_owner) revert FundIndia_NotOwner();
        _;
    }

    //Functions Order:
    //// 1. Constructor
    //// 2. Receive
    //// 3. Fallback
    //// 4. External
    //// 5. Public
    //// 6. Internal
    //// 7. Private
    //// 8. View / Pure
    
    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    function fund() public payable {
        require(msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD, "You need to spend more ETH!");
        // require(PriceConverter.getConversionRate(msg.value) >= MINIMUM_USD, "You need to spend more ETH!");
        s_addressToAmountFunded[msg.sender] += msg.value;
        funders.push(msg.sender);
    }
    
    function getVersion() public view returns (uint256){
        return s_priceFeed.version();
    }
    
    function withdraw() public onlyOwner {
        for (uint256 funderIndex=0; funderIndex < s_funders.length; funderIndex++){
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        // // transfer
        // payable(msg.sender).transfer(address(this).balance);
        // // send
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send failed");
        // call
        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "Call failed");
    }
    // Explainer from: https://solidity-by-example.org/fallback/
    // Ether is sent to contract
    //      is msg.data empty?
    //          /   \ 
    //         yes  no
    //         /     \
    //    receive()?  fallback() 
    //     /   \ 
    //   yes   no
    //  /        \
    //receive()  fallback()
}

// Concepts we didn't cover yet (will cover in later sections)
// 1. Enum
// 2. Events
// 3. Try / Catch
// 4. Function Selector
// 5. abi.encode / decode
// 6. Hash with keccak256
// 7. Yul / Assembly

