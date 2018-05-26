pragma solidity 0.4.24;

import "./lib/KittyInterface.sol";
import "./Random.sol";

contract KittyArena is Random {
	struct Player {
		uint256 kitty;
		address addr;
	}

	struct Game {
		Player player1;
		Player player2;
		uint256 fightBlock;
		address winner;
	}

	KittyInterface ck;
	Game[] games;

	event KittyPledge(uint256 indexed gameId, uint256 indexed kittyId, address indexed owner);
	event StartFight(uint256 indexed gameId, uint256 fightBlock);
	event SolvedFight(uint256 indexed gameId, address indexed winner);

	constructor (KittyInterface _ck) public {
		ck = _ck;
	}

	function pledge(uint256 kitty) {
		ck.transferFrom(msg.sender, this, kitty);

		Player storage player;
		Game storage game;

		if (games[games.length - 1].fightBlock == 0) {
			// player is player2 for game
			game = games[games.length - 1];
			game.player2 = Player(kitty, msg.sender);
			game.fightBlock = block.number;

			player = game.player2;

			emit StartFight(games.length - 1, game.fightBlock);
		} else {
			games.length += 1;
			game = games[games.length - 1];
			game.player1 = Player(kitty, msg.sender);

			player = game.player1;
		}

		emit KittyPledge(games.length - 1, player.kitty, player.addr);
	}

	function solve(uint256 gameId) {
		Game storage game = games[gameId];
		require(game.winner == address(0));

		game.winner = getWinner(gameId);
		
		ck.transfer(game.winner, game.player1.kitty);
		ck.transfer(game.winner, game.player2.kitty);

		emit SolvedFight(gameId, game.winner);
	}

	function getWinner(uint256 gameId) public view returns (address) {
		Game storage game = games[gameId];
		if (game.winner != address(0)) {
			return game.winner;
		}

		var (,,,,,,,,,genes1) = ck.getKitty(game.player1.kitty);
		var (,,,,,,,,,genes2) = ck.getKitty(game.player2.kitty);

		uint256 seed = maxRandom(game.fightBlock);
		uint256 result = uint256(keccak256(seed, genes1, genes2));

		// TODO: Genes
		return result % 2 == 0 ? game.player1.addr : game.player2.addr;
	}
}