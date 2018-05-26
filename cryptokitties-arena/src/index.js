import React from 'react';
import ReactDOM from 'react-dom';

import 'materialize-css'; // It installs the JS asset only
import 'materialize-css/dist/css/materialize.min.css';
import 'animate.css';

import './index.css';

var Web3 = require('web3');
var web3 = new Web3();
let web3js = null;

window.addEventListener('load', function() {

  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    web3js = new Web3(web3.currentProvider);
    console.log("Using Metamask/Mist WEB3 provider")
  } else {
    alert('Something went bad, sory dude')
  }
  web3js.eth.getAccounts(function (err, accounts) {
    console.log('hereeee')
    console.log(err, accounts)
    /*web3js.eth.getBalance(accounts[0], function (err, balance) {
      console.log('Your balance is ' + Web3.fromWei(balance, 'ether'))
    })*/
  })
})
//web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io'));


class App extends React.Component {
  render() {
    return <h3 classnames="animated fadeInUp">Welcome to the Crypto Kitties Arena</h3>;
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
/*
let account = null;

web3js.eth.getCoinbase(function(err, account) {
  console.log(err, account)
  if (err === null) {
    account = account;
    //$("#account").text(account);
    /*web3.eth.getBalance(account, function(err, balance) {
      if (err === null) {
        $("#accountBalance").text(web3.fromWei(balance, "ether") + " ETH");
      }
    });
  }
});

web3js.eth.getBalance(account, (err, balance) => {
  console.log(web3js.fromWei(balance, "ether") + " ETH")
});
*/
