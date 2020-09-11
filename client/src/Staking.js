import React, { Component } from "react";
import NyanToken from "./contracts/NyanToken.json";
import CatnipToken from "./contracts/CatnipToken.json";
import {getWeb3Var} from "./shared";

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

  /** getters */
  getAllowance = async () => {
    let _nyanAllowance = await this.nyanInstance.methods.allowance(this.accounts[0], this.catnipInstance._address).call();
    if (_nyanAllowance > 0) {
        this.setState({isApproved: true, allowance: this.web3.utils.fromWei(_nyanAllowance.toString())})
    }
  }

  getNyanBalance = async () => {
    let _nyanBalance = await this.nyanInstance.methods.balanceOf(this.accounts[0]).call();
    this.setState({
      nyanBalance: this.web3.utils.fromWei(_nyanBalance)
    })
  }

  getNyanSupply = async () => {
    let _nyanSupply = await this.nyanInstance.methods.totalSupply().call();
    this.setState({
      totalNyanSupply: this.web3.utils.fromWei(_nyanSupply)
    })
  }

  getMyStakeAmount = async () => {
    let stakeA = await this.catnipInstance.methods.getAddressStakeAmount(this.accounts[0]).call();
    
    this.setState({stakedAmount: this.web3.utils.fromWei(stakeA)});
  }

  getCatnipRewards = async () => {
    
    let cRewards = await this.catnipInstance.methods.myRewardsBalance(this.accounts[0]).call();

    this.setState({catnipRewards: this.web3.utils.fromWei(cRewards)});
  }

  /** setters & modifiers */
  updateStakingInput(e) {
    this.setState({stakeAmount: e.target.value})
    
    if (this.state.stakeAmount > this.state.allowance || this.state.nyanBalance){
      // disable button
      
    } else {
      // enable button
    }
    
    /*
    if (this.state.stakeAmount > this.state.allowance && !this.state.isApproved) {
        this.setState({isApproved: false})
    }
    */
  }

  stakeNyan = async () => {
    if ((this.state.isStaking || this.state.stakeAmount === 0) || (this.state.stakeAmount > this.state.nyanBalance)) {
        return;
    }

    this.setState({isStaking: true});
    try {
        let stakeRes = await this.catnipInstance.methods.stake(this.web3.utils.toWei(this.state.stakeAmount.toString())).send({
            from: this.accounts[0]
        });
        if (stakeRes["status"]) {
            this.setState({isStaking: false, stakeAmount: 0});
            this.getMyStakeAmount();
        }
    } catch (error) {
        console.log(error);
    }
  }

  withdrawNyan = async () => {
    if (this.state.isWithdrawing || this.state.stakeAmount === 0) {
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

  setInputField() {
    if (this.state.stakeAmount > 0) {
      return this.state.stakeAmount;
    } else {
      return '';
    }
  }

  setMaxNyan() {
    this.setState({stakeAmount: this.state.nyanBalance});
  }

  claimRewards = async () => {
    if(this.state.catnipRewards > 0){
      await this.catnipInstance.methods.getReward().send({
        from: this.accounts[0]
      });
      
      this.getCatnipRewards();
    }
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
        process.env.REACT_APP_NYAN_TOKEN_CONTRACT_ADDRESS
      );
     
      this.catnipInstance = new this.web3.eth.Contract(
        CatnipToken.abi,
        process.env.REACT_APP_CATNIP_TOKEN_CONTRACT_ADDRESS
      );

      this.getAllowance();
      this.getNyanSupply();
      this.getNyanBalance();
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
              <img className="balance-logo-image" alt="nyan logo" src={nyanLogo}/>
            </div>
            <div className="inline-block">
              <div className="top-box-desc">Amount staked</div>
              <div className="top-box-val nyan-balance">{this.state.stakedAmount}</div>
            </div>
            <div className="inline-block">
              <div className="top-box-desc">Your  NYAN balance</div>
              <div className="top-box-val nyan-balance">{this.state.nyanBalance}</div>
            </div>
          </div>
            <div className="max-container">
              <button className="as-link" onClick={this.setMaxNyan.bind(this)}>Max amount</button>
            </div>
            <div>
                <input 
                className="input-amount" 
                placeholder="Amount..."
                value={this.setInputField()} 
                onChange={this.updateStakingInput.bind(this)}
                type="number"
                autoFocus={true}>
                </input>
            </div>
            <br />
            {!this.state.isApproved ? <div className="button stake-button" onClick={this.approveNyan}>
                {!this.state.isApproving ? <div>STEP 1/2: APPROVE</div> : null}
                {this.state.isApproving ? <div>APPROVING...</div> : null}
            </div> : null}
            {this.state.isApproved ? <div className={`button stake-button ${this.state.stakeAmount > 0 && this.state.stakeAmount < this.state.nyanBalance ? "" : "disabled"}`} onClick={this.stakeNyan}>
                {!this.state.isStaking ? <div>STEP 2/2: STAKE</div> : null}
                {this.state.isStaking ? <div>STAKING...</div> : null}
            </div> : null}
            <div className={`button withdraw-button ${this.state.nyanBalance > 0 || this.state.stakeAmount > 0 && this.state.stakeAmount <= this.state.stakedAmount ? "" : "disabled"}`} onClick={this.withdrawNyan}>
                {!this.state.isWithdrawing ? <div>WITHDRAW</div> : null}
                {this.state.isWithdrawing ? <div>WITHDRAWING...</div> : null}
            </div>

            <div>
              <div className="align-left"><h1>GET CATNIP</h1></div>
              <div className="align-right max-container">
                <button className="as-link" onClick={this.getCatnipRewards}>UPDATE</button>
              </div>
              <div className="clear"></div>
            </div>
            <div>
            <p>INFO: Catnip rewards grow per block and are updated on each transaction(send) to functions 
                with the "updateStakingRewards" modifier.</p>
            </div>
            <div>
                <input className="input" disabled 
                value={this.state.catnipRewards}
                placeholder={this.state.catnipRewards} type="number"></input>
            </div>
            <br />
            <div className={`button stake-button ${this.state.catnipRewards > 0 ? "" : "disabled"}`} onClick={this.claimRewards}>CLAIM</div>
        </div>
      </div>
    );
  }
}