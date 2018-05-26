pragma solidity ^0.4.21;

import "../../contracts/lib/KittyInterface.sol";
import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';

contract MockKittyCore is KittyInterface, ERC721Token("MockKittyCore", "MCK") {

    function mint(address _to, uint256 _tokenId) {
        _mint(_to, _tokenId);
    }

	function transfer(address to, uint256 kittyId) {
        transferFrom(msg.sender, to, kittyId);
    }
	function getKitty(uint256 _id) external view returns (bool isGestating, bool isReady, uint256 cooldownIndex, uint256 nextActionAt, uint256 siringWithId, uint256 birthTime, uint256 matronId, uint256 sireId, uint256 generation, uint256 genes) {}
}
