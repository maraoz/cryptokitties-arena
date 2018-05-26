'use strict';

require('chai')
  .use(require('chai-bignumber')(web3.BigNumber))
  .should();

const KittyArena = artifacts.require('KittyArena')
const MockKittyCore = artifacts.require('MockKittyCore')
const MockDestiny = artifacts.require('MockDestiny')

contract('KittyArena', function ([_, p1, p2, p3]) {

  beforeEach(async function () {
    this.ck = await MockKittyCore.new()
    this.destiny = await MockDestiny.new()
    this.arena = await KittyArena.new(this.ck.address, this.destiny.address)
  })

  const kitty1 = 42
  const kitty2 = 69
  const kitty3 = 1337

  describe('enter mechanic', function() {
    it('first kitty can enter', async function() {
      await this.ck.approve(this.arena.address, kitty1, {from: p1})
      const tx = await this.arena.enter(kitty1, {from: p1})
      tx.logs.length.should.equal(1)
      tx.logs[0].event.should.equal('KittyEntered')
      tx.logs[0].args.gameId.should.bignumber.equal(0)
      tx.logs[0].args.kittyId.should.bignumber.equal(kitty1)
      tx.logs[0].args.owner.should.equal(p1)
    })

    it('second kitty can enter and fight starts', async function() {
      // first player approve and enter
      await this.ck.approve(this.arena.address, kitty1, {from: p1})
      await this.arena.enter(kitty1, {from: p1})

      // second player approve and enter
      await this.ck.approve(this.arena.address, kitty2, {from: p2})
      const tx = await this.arena.enter(kitty2, {from: p2})
      tx.logs.length.should.equal(2)
      tx.logs[0].event.should.equal('FightStarted')
      tx.logs[0].args.gameId.should.bignumber.equal(0)
      tx.logs[0].args.fightBlock.should.bignumber.equal(web3.eth.blockNumber)
      tx.logs[1].event.should.equal('KittyEntered')
      tx.logs[1].args.kittyId.should.bignumber.equal(kitty2)
      tx.logs[1].args.owner.should.equal(p2)
    })

    it('third kitty can enter and create new game', async function() {
      // first player approve and enter
      await this.ck.approve(this.arena.address, kitty1, {from: p1})
      await this.arena.enter(kitty1, {from: p1})

      // second player approve and enter
      await this.ck.approve(this.arena.address, kitty2, {from: p2})
      await this.arena.enter(kitty2, {from: p2})

      // third player approve and enter
      await this.ck.approve(this.arena.address, kitty3, {from: p3})
      const tx = await this.arena.enter(kitty3, {from: p3})

      tx.logs.length.should.equal(1)
      tx.logs[0].event.should.equal('KittyEntered')
      tx.logs[0].args.gameId.should.bignumber.equal(1)
      tx.logs[0].args.kittyId.should.bignumber.equal(kitty3)
      tx.logs[0].args.owner.should.equal(p3)
    })
  })

  describe('resolve mechanic', function() {

  })

})
