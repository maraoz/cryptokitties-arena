'use strict';

const Random = artifacts.require('Random');
const RandomUseExample = artifacts.require('RandomUseExample');

contract('Random', function () {
  beforeEach(async function () {
    this.random = await Random.new();
    this.dice = await RandomUseExample.new(this.random.address);
  });

  it('can generate random numbers', async function() {
    await this.dice.roll()
    var d6 = await this.dice.d6()
    console.log(d6)
    await this.dice.roll()
    d6 = await this.dice.d6()
    console.log(d6)
    await this.dice.roll()
    d6 = await this.dice.d6()
    console.log(d6)
    await this.dice.roll()
    d6 = await this.dice.d6()
    console.log(d6)
  })

});
