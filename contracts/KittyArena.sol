pragma solidity 0.4.24;

import "./lib/KittyCore.sol";

contract KittyArena {
	struct Player {
		uint256 id;
		address owner;
	}

	struct Game {
		Player player1;
		Player player2;
		uint256 resolveBlock;
		address winner;
	}

	KittyCore ck;
	Game[] games;

	constructor(KittyCore _ck) {
		ck = _ck;
	}

	function pledge(uint256 kitty) {
		ck.transferFrom(msg.sender, this, kitty);

		Player player = Player(id, msg.sender);

		if (!games[games.length - 1].resolveBlock) {
			onHoldKitty = kitty;
		} else {
			delete onHoldKitty;
		}
	}
}