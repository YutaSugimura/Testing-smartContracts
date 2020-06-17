pragma solidity >=0.5.1 <0.7.0;

import "@openzeppelin/contracts/utils/Strings.sol";

contract CheckTypeConversion {

  function fromUint256(uint256 value) public pure returns (string memory) {
    return Strings.toString(value);
  }

}