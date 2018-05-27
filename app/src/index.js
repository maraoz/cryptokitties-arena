import React from 'react';
import ReactDOM from 'react-dom';

import 'materialize-css'; // It installs the JS asset only
import 'materialize-css/dist/css/materialize.min.css';
import 'animate.css';

import logo from './assets/img/logo-crypto-kitties-fight.svg';

import './index.css';
import { debug } from 'util';

var KittyArenaABI = require("./assets/contracts/KittyArena.json");
var KittyArenaAddress = "0x3686e7Ec62D5694A8aC05f8F39FD5F632e2fF79b";
var KittyCoreABI = require("./assets/contracts/KittyCore.json");
var KittyCoreAddress = "0x06012c8cf97BEaD5deAe237070F9587f8E7A266d";

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

class Kitty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'kitty': props.kitty
    }
    this.authorize = this.authorize.bind(this);
    this.enterArena = this.enterArena.bind(this);
  }

  authorize(e) {
    e.preventDefault();
    this.props.KittyCore.approve(KittyArenaAddress, this.state.kitty.id, {from: this.props.account})
  }

  enterArena(e) {
    e.preventDefault();
    this.props.KittyArena.enter(this.state.kitty.id, {from: this.props.account})
  }

  render() {
    return (
      <span>
        <img width="100px" src={this.state.kitty.image_url_cdn}/>
        <button className="btn" onClick={this.authorize}>Authorize</button>
        <button className="btn" onClick={this.enterArena}>Enter Arena</button>
      </span>
    )
  }
}

function KittiesList(props) {
  const kitties = props.kitties || [];
  const listItems = kitties.map((kitty) =>
    <li key={kitty.id}>
      <Kitty kitty={kitty} KittyCore={props.KittyCore} account={props.account} KittyArena={props.KittyArena}/>
    </li>
  );
  return (
    <div>
      <h3 className="center-align title-secondary">Select one of your kitties</h3>
      <ul>{listItems}</ul>
    </div>
  );
}

class Kitties extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'kitties': [],
      'loading': true,
      'KittyCore': null,
      'account': null
    }
    var that = this;
    window.addEventListener('load', function() {
      if (typeof web3 !== 'undefined') {
        var myWeb3 = new Web3(window.web3.currentProvider);

        var KittyArena = window.web3.eth.contract(KittyArenaABI).at(KittyArenaAddress);
        that.state.KittyArena = KittyArena;
        var KittyCore = window.web3.eth.contract(KittyCoreABI).at(KittyCoreAddress);
        that.state.KittyCore = KittyCore;

        myWeb3.eth.getAccounts(function (err, accounts) {
          that.setState({'account': accounts[0]});
          getKitties(accounts[0], function(kitties) {
            console.log(kitties);
            that.setState({'kitties': kitties, 'loading': false});
          });
        });
      }
    });
  }
  render() {
    return (<KittiesList kitties={this.state.kitties} 
                         KittyCore={this.state.KittyCore} 
                         KittyArena={this.state.KittyArena}
                         account={this.state.account}/>)
  }
}

class Arena extends React.Component {
  render() {
    return (<h3 className="center-align title-secondary">Now fight on the Arena ⚔</h3>)
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      titleClasses: 'title title-primary',
    }
    /*let that = this;
    setTimeout(function(){
      that.setState({titleClasses: 'animated fadeInUp'})
    }, 1200)*/
  }

  render() {
  return (
    <div>
      <div className="row">
        <div className="col m3">
          <img id="logo" src={logo} />
        </div>
        <div className="col m9 valign-wrapper">
          <h2 className={this.state.titleClasses}>Crypto Kitties Arena</h2>
        </div>
      </div>
      <hr className="blue-grey darken-3 hr-middle"/>
      <div className="row">
        <div className="col m4"><Kitties /></div>
        <div className="col m8"><Arena /></div>
      </div>
    </div>
  );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
