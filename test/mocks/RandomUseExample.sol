pragma solidity ^0.4.21;

import "../../contracts/Random.sol";

contract RandomUseExample {
  Random r;

  uint256 public d6 = 1;

  function RandomUseExample(Random _r) public {
    r = _r;
  }

  function roll() public {
    d6 = r.random(6);
  }
}
