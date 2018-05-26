pragma solidity ^0.4.21;

import "../../contracts/interfaces/Destiny.sol";

contract MockDestiny is Destiny {
    function fight(bytes32 cat1, bytes32 cat2, bytes32 entropy) public returns (bytes32 winner) {
      return cat1;
    }
}

contract MockTiedDestiny is Destiny {
    function fight(bytes32 cat1, bytes32 cat2, bytes32 entropy) public returns (bytes32 winner) {
      return 0;
    }
}
