'use strict';

require('chai')
  .use(require('chai-bignumber')(web3.BigNumber))
  .use(require('chai-as-promised'))
  .should();

const KittyArena = artifacts.require('KittyArena')
const MockKittyCore = artifacts.require('MockKittyCore')
const CatDestiny = artifacts.require('CatDestiny')

contract('KittyArena integration with real CatDestiny', function ([_, p1, p2]) {

  const kitty1 = 43
  const kitty2 = 70

  beforeEach(async function () {
    this.ck = await MockKittyCore.new()
    await this.ck.mint(p1, kitty1);
    await this.ck.mint(p2, kitty2);
    this.destiny = await CatDestiny.new()
    this.arena = await KittyArena.new(this.ck.address, this.destiny.address)
  })

  it('can resolve a game with two kitties', async function() {

    // first player approve and enter
    await this.ck.approve(this.arena.address, kitty1, {from: p1})
    await this.arena.enter(kitty1, {from: p1})
    
    // second player approve and enter
    await this.ck.approve(this.arena.address, kitty2, {from: p2})
    await this.arena.enter(kitty2, {from: p2})

    const gameId = 0
    const tx = await this.arena.resolve(gameId)

    console.log(p1, p2)
    tx.logs.length.should.equal(1)
    tx.logs[0].event.should.equal('FightResolved')
    tx.logs[0].args.gameId.should.bignumber.equal(gameId)
    tx.logs[0].args.winner.should.equal(p1)

  })

})
