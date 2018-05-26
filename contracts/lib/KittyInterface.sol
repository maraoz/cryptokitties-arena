pragma solidity 0.4.24;

contract KittyInterface {
    function approve(address _to, uint256 _tokenId) external;
	function transfer(address to, uint256 kittyId);
	function transferFrom(address from, address to, uint256 kittyId);
	function getKitty(uint256 _id) external view returns (bool isGestating, bool isReady, uint256 cooldownIndex, uint256 nextActionAt, uint256 siringWithId, uint256 birthTime, uint256 matronId, uint256 sireId, uint256 generation, uint256 genes);
}
