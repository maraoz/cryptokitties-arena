'use strict';

require('babel-register')
require('babel-polyfill')

const PrivateKeyProvider = require('truffle-privatekey-provider')

module.exports = {
  networks: {
    local: {
      host: 'localhost',
      port: 8545,
      gas: 10000000,
      network_id: '*'
    },
    seba: {
      host: '0.tcp.ngrok.io',
      port: 19575,
      network_id: '1'
    },
    zep: {
      host: 'localhost',
      port: 8546,
      network_id: '1'
    },
    mainnet: {
      network_id: '1',
      gas: 6.5e6,
      gasPrice: 7500000000, // 7.5 gwei
      provider: () => {
        const { rpc, key } = require(require('homedir')()+'/.rinkebykey.json')
        return new PrivateKeyProvider(key, 'https://mainnet.infura.io')
      }
    }
  }
};
