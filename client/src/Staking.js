import React, { Component } from "react";
import NyanToken from "./contracts/NyanToken.json";
import CatnipToken from "./contracts/CatnipToken.json";
import getWeb3 from "./getWeb3";
import {setWeb3, getWeb3Var} from "./shared";
import App from "./App";

import nyanLogo from './assets/nyan-logo.png';

export default class Staking extends Component {

state = {
    loaded: false,
    stakeAmount: 0,
    stakedAmount: 0,
    isApproved: false,
    isApproving: false,
    isStaking: false,
    isWithdrawing: false,
    catnipRewards: 0,
    totalNyanSupply: 0,
    allowance: 0
    };
  
  handleClick = () => {
    this.props.toggle();
  };

  updateStakingInput(e) {
    this.setState({stakeAmount: e.target.value})
    if (this.state.stakeAmount > this.state.allowance) {
        this.setState({isApproved: false})
    }
 }

 getAllowance = async () => {
    let _nyanAllowance = await this.nyanInstance.methods.allowance(this.accounts[0], this.catnipInstance._address).call();
    if (_nyanAllowance > 0) {
        this.setState({isApproved: true, allowance: this.web3.utils.fromWei(_nyanAllowance.toString())})
    }
  }

  toFixed(num, fixed) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
  }

  getNyanBalance = async () => {
    let _nyanBalance = await this.nyanInstance.methods.balanceOf(this.accounts[0]).call();
    this.setState({
      stakeAmount: toFixed(this.web3.utils.fromWei(_nyanBalance), 6);
    })
  }

  stakeNyan = async () => {
    if (this.state.isStaking) {
        return;
    }                        
    this.setState({isStaking: true});
    try {
        let stakeRes = await this.catnipInstance.methods.stake(this.web3.utils.toWei(this.state.stakeAmount.toString())).send({
            from: this.accounts[0]
        });
        if (stakeRes["status"]) {
            this.setState({isStaking: false, isApproved: false, stakeAmount: 0});
            this.getMyStakeAmount();
        }
    } catch (error) {
        console.log(error);
    }

  }

  withdrawNyan = async () => {
    if (this.state.isWithdrawing) {
        return;
    }
    this.setState({isWithdrawing: true});
    try {
        let unstakeRes = await this.catnipInstance.methods.withdraw(this.web3.utils.toWei(this.state.stakeAmount.toString())).send({
            from: this.accounts[0]
        });
    
        if (unstakeRes["status"]) {
            this.setState({isWithdrawing: false, stakeAmount: 0});
            this.getMyStakeAmount();
        } else {
            this.setState({isWithdrawing: false});
        }
    } catch (error) {
        console.log(error);
    }
  }

  getNyanSupply = async () => {
    let _nyanSupply = await this.nyanInstance.methods.totalSupply().call();
    this.setState({
      totalNyanSupply: this.web3.utils.fromWei(_nyanSupply)
    })
  }

  approveNyan = async () => {
    if (this.state.isApproving) {
        return;
    }  
    this.setState({isApproving: true});
    
    let approveStaking = await this.nyanInstance.methods.approve(this.catnipInstance._address, this.web3.utils.toWei(this.state.totalNyanSupply.toString())).send({
        from: this.accounts[0]
    });
    
    if (approveStaking["status"]) {
        this.setState({isApproving: false, isApproved: true});
        
    }
  }

  getMyStakeAmount = async () => {
    let stakeA = await this.catnipInstance.methods.getAddressStakeAmount(this.accounts[0]).call();
    
    this.setState({stakedAmount: this.web3.utils.fromWei(stakeA)});
  }

  getCatnipRewards = async () => {
    
    let cRewards = await this.catnipInstance.methods.myRewardsBalance(this.accounts[0]).call();

    this.setState({catnipRewards: this.web3.utils.fromWei(cRewards)});
  }

  claimRewards = async () => {
    let claim = await this.catnipInstance.methods.getReward().send({
        from: this.accounts[0]
    });
    
    this.getCatnipRewards();
  }

  componentDidMount = async () => {

    try {
      this.web3 = getWeb3Var();
        
      // Get network provider and web3 instance.
     
      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();
    
      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();

      this.nyanInstance = new this.web3.eth.Contract(
        NyanToken.abi,
        "0xc9ce70a381910d0a90b30d408cc9c7705ee882de"
      );

      this.catnipInstance = new this.web3.eth.Contract(
        CatnipToken.abi,
        "0xd2b93f66fd68c5572bfb8ebf45e2bd7968b38113",
      );

      this.getAllowance();
      this.getNyanSupply()
      this.getMyStakeAmount();
      this.getCatnipRewards();

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({loaded: true});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
    return (
      <div className="modal">
        <div className="modal_content">
          <span className="close" onClick={this.handleClick}>
            &times;
          </span>
          <h1>STAKE NYAN</h1>
          <div className="amount-staked-box">
            <div className="inline-block amount-staked-image">
              <img className="balance-logo-image" src={nyanLogo}/>
            </div>
            <div className="inline-block">
              <div className="top-box-desc">Amount staked</div>
              <div className="top-box-val nyan-balance">{this.state.stakedAmount}</div>
            </div>
          </div>
            <div>
                <input 
                className="input" 
                placeholder="0"
                value={this.state.stakeAmount} 
                onChange={this.updateStakingInput.bind(this)}
                type="number">

                </input>
            </div>
            <br />
            {!this.state.isApproved ? <div className="button stake-button" onClick={this.approveNyan}>
                {!this.state.isApproving ? <div>STEP 1: APPROVE</div> : null}
                {this.state.isApproving ? <div>APPROVING...</div> : null}
            </div> : null}
            {this.state.isApproved ? <div className="button stake-button" onClick={this.stakeNyan}>
                {!this.state.isStaking ? <div>STEP 2: STAKE</div> : null}
                {this.state.isStaking ? <div>STAKING...</div> : null}
            </div> : null}
            <div className="button withdraw-button" onClick={this.withdrawNyan}>
                {!this.state.isWithdrawing ? <div>WITHDRAW</div> : null}
                {this.state.isWithdrawing ? <div>WITHDRAWING...</div> : null}
            </div>

            <h1>GET CATNIP</h1>
            <div className="updateC" onClick={this.getCatnipRewards}>UPDATE</div>
            <p>INFO: Catnip rewards grow per block and are updated on each transaction(send) to functions 
                with the "updateStakingRewards" modifier.</p>
            <div>
                <input className="input" disabled 
                value={this.state.catnipRewards}
                placeholder="0" type="number"></input>
            </div>
            <br />
            <div className="button stake-button" onClick={this.claimRewards}>CLAIM</div>
        </div>
      </div>
    );
  }
}
