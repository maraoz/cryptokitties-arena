import React from 'react';
import ReactDOM from 'react-dom';

import 'materialize-css'; // It installs the JS asset only
import 'materialize-css/dist/css/materialize.min.css';
import 'animate.css';

import './index.css';
import { debug } from 'util';

var Web3 = require('web3');
var request = require('request');

function getKitties(address, callback) {
  request('https://api.cryptokitties.co/v2/kitties?offset=0&limit=50&owner_wallet_address=' + address, { json: true }, (err, res, body) => {
    if (err) { console.log(err); return null;}
    // var data = JSON.parse(body);
    callback(body["kitties"]);
  });
}

window.addEventListener('load', function() {
  if (typeof web3 !== 'undefined') {
    var myWeb3 = new Web3(window.web3.currentProvider);
    myWeb3.eth.getAccounts(function (err, accounts) {
      myWeb3.eth.getBalance(accounts[0], function (err, balance) {
        console.log('Your balance is ' + window.web3.fromWei(balance, 'ether'))   
      });
    });
  }
})
//web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io'));

class Kitty extends React.Component {
  render() {
    return (<p>Kitty</p>)
  }
}

function KittiesList(props) {
  const kitties = props.kitties || [];
  const listItems = kitties.map((kitty) =>
    <li key={kitty.id}>
      <img width="100px" src={kitty.image_url_cdn}/>
      {kitty.name}
    </li>
  );
  return (
    <div>
      <h2>Kitties</h2>
      <ul>{listItems}</ul>
    </div>
  );
}

class Kitties extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'kitties': [{'id': 1}]
    }
    var that = this;
    window.addEventListener('load', function() {
      if (typeof web3 !== 'undefined') {
        var myWeb3 = new Web3(window.web3.currentProvider);
        myWeb3.eth.getAccounts(function (err, accounts) {
          getKitties(accounts[0], function(kitties) {
            // that.setState({'kitties': [{'id': 2}]})
            debugger
            that.setState({'kitties': kitties});
          });
        });
      }
    });
  }
  render() {
    return (<KittiesList kitties={this.state.kitties} />)
  }
}

class Arena extends React.Component {
  render() {
    return (<h2>Arena</h2>)
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
  return (
    <div>
    <h3 classnames="animated fadeInUp">Welcome to the Crypto Kitties Arena</h3>
      <div className="container">
          <div className="row">
            <div className="col"><Kitties /></div>
            <div className="col"><Arena /></div>
          </div>
      </div>
    </div>
  );
  }
}

ReactDOM.render(
  <Game />,
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
