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

	KittyInterface public ck;
	Destiny destiny;
	Game[] public games;

	address constant public TIE = address(-2);

	event KittyEntered(uint256 indexed gameId, uint256 indexed kittyId, address indexed owner);
	event FightStarted(uint256 indexed gameId, uint256 fightBlock);
	event FightResolved(uint256 indexed gameId, address indexed winner);

	constructor (KittyInterface _ck, Destiny _destiny) public {
		ck = _ck;
		destiny = _destiny;
	}

	function enter(uint256 kitty) external {
		ck.transferFrom(msg.sender, this, kitty);
		Player storage player;
		Game storage game;

		if (games.length > 0 && games[games.length - 1].fightBlock == 0) {
			// player is player2 for game
			game = games[games.length - 1];
			game.player2 = Player(kitty, msg.sender);
			game.fightBlock = block.number;

			player = game.player2;

			emit FightStarted(games.length - 1, game.fightBlock);
		} else {
			games.length += 1;
			game = games[games.length - 1];
			game.player1 = Player(kitty, msg.sender);

			player = game.player1;
		}

		emit KittyEntered(games.length - 1, player.kitty, player.addr);
	}

	function resolve(uint256 gameId) external {
		Game storage game = games[gameId];
		require(game.winner == address(0));
        require(game.player1.addr != address(0));
        require(game.player2.addr != address(0));

		game.winner = getWinner(gameId);
		
		ck.transfer(game.winner == TIE ? game.player1.addr : game.winner, game.player1.kitty);
		ck.transfer(game.winner == TIE ? game.player2.addr : game.winner, game.player2.kitty);

		emit FightResolved(gameId, game.winner);
	}

	function getWinner(uint256 gameId) public view returns (address) {
		Game storage game = games[gameId];
		if (game.winner != address(0)) {
			return game.winner;
		}

		bytes32 genes1 = catGenes(game.player1.kitty);
		bytes32 genes2 = catGenes(game.player2.kitty);

		require(block.number > game.fightBlock);
		bytes32 seed = bytes32(maxRandom(game.fightBlock));
		
		// If game isn't resolved in 256 blocks and we cannot get the entropy,
		// we considered it tie
		if (seed == bytes32(0)) {
			return TIE;
		}

		bytes32 winnerGenes = destiny.fight(genes1, genes2, seed);

		if (winnerGenes == genes1) {
			return game.player1.addr;
		} 

		if (winnerGenes == genes2) { 
			return game.player2.addr;
		}

		// Destiny may return something other than one of the two cats gens,
		// if so we consider it a tie
		return TIE;
	}

	function catGenes(uint256 kitty) private view returns (bytes32 genes) {
		var (,,,,,,,,,_genes) = ck.getKitty(kitty);
		genes = bytes32(_genes);
	}
}
