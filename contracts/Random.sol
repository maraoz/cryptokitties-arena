pragma solidity ^0.4.18;

/**
 * PRNG, source: https://github.com/axiomzen/eth-random
 */
contract Random {
  // The upper bound of the number returns is 2^bits - 1
  function bitSlice(uint256 n, uint256 bits, uint256 slot) public pure returns(uint256) {
      uint256 offset = slot * bits;
      // mask is made by shifting left an offset number of times
      uint256 mask = uint256((2**bits) - 1) << offset;
      // AND n with mask, and trim to max of 5 bits
      return uint256((n & mask) >> offset);
  }

  function maxRandom(uint256 sourceBlock) public view returns (uint256 randomNumber) {
    require(block.number != sourceBlock && block.number - 256 >= sourceBlock);
    randomNumber = uint256(block.blockhash(sourceBlock));
    assert(randomNumber > 0);
  }

  function random(uint256 upper) public view returns (uint256 randomNumber) {
    return random(upper, block.number - 1);
  }

  // return a pseudo random number between lower and upper bounds
  // given the number of previous blocks it should hash.
  function random(uint256 upper, uint256 sourceBlock) public returns (uint256 randomNumber) {
    return maxRandom(sourceBlock) % upper;
  }
}
