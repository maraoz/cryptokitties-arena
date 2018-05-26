'use strict';

const KittyArena = artifacts.require('KittyArena')
const MockKittyCore = artifacts.require('MockKittyCore')

contract('KittyArena', function ([_, p1, p2]) {

  beforeEach(async function () {
    this.ck = await MockKittyCore.new()
    this.arena = await KittyArena.new(this.ck.address)
  })

  const kitty1 = 42;
  const kitty2 = 69;

  it('first player can pledge', async function() {
    await this.ck.approve(this.arena.address, kitty1, {from: p1})
    await this.arena.pledge(42, {from: p1})
  })

});
