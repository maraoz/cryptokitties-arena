'use strict';

require('babel-register')
require('babel-polyfill')

module.exports = {
  networks: {
    local: {
      host: 'localhost',
      port: 9545,
      gas: 5000000,
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
    }
  }
};
