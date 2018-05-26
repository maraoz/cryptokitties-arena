pragma solidity 0.4.24;

import "./interfaces/Destiny.sol";
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
	Destiny destiny;
	Game[] games;

	event KittyPledge(uint256 indexed gameId, uint256 indexed kittyId, address indexed owner);
	event StartFight(uint256 indexed gameId, uint256 fightBlock);
	event SolvedFight(uint256 indexed gameId, address indexed winner);

	constructor (KittyInterface _ck, Destiny _destiny) public {
		ck = _ck;
		destiny = _destiny;
	}

	function pledge(uint256 kitty) {
		ck.transferFrom(msg.sender, this, kitty);
		Player storage player;
		Game storage game;

		if (games.length > 0 && games[games.length - 1].fightBlock == 0) {
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

	function catGenes(uint256 kitty) private view returns (bytes32 genes) {
		var (,,,,,,,,,_genes) = ck.getKitty(kitty);
		genes = bytes32(_genes);
	}

	function getWinner(uint256 gameId) public view returns (address) {
		Game storage game = games[gameId];
		if (game.winner != address(0)) {
			return game.winner;
		}

		bytes32 genes1 = catGenes(game.player1.kitty);
		bytes32 genes2 = catGenes(game.player2.kitty);

		bytes32 seed = bytes32(maxRandom(game.fightBlock));
		bytes32 winner = destiny.fight(genes1, genes2, seed);

		// TODO: Genes
		return winner == genes1 ? game.player1.addr : game.player2.addr;
	}
}
