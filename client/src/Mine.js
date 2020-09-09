import React, { Component } from "react";
import DarkNyan from "./contracts/DarkNyan.json";
import DarkNyanUni from "./contracts/DarkNyanUni.json";
import {getWeb3Var} from "./shared";

import ethLogo from './assets/eth.png';
import catnipLogo from './assets/catnip.png';

export default class Pump extends Component {
state = {
    loaded: false,
    stakeAmount: 0,
    stakedAmount: 0,
    dUniAmount: 0,
    miningStarted: true,
    isApproved: false,
    isApproving: false,
    isStaking: false,
    isWithdrawing: false,
    darkNyanRewards: 0,
    totalDNyanUniSupply: 0,
    allowance: 0
    };

  handleClick = () => {
    this.props.toggle();
  };

  setInputField() {
    if (this.state.stakeAmount > 0) {
      return this.state.stakeAmount;
    } else {
      return null
    }
  }

  updateStakingInput(e) {
    this.setState({stakeAmount: e.target.value})
    if (this.state.stakeAmount > this.state.allowance) {
        this.setState({isApproved: false})
    }
 }

  getDUniAmount = async () => {
    let _dUniAmount = await this.DarkNyanUniInstance.methods.balanceOf(this.accounts[0]).call();
    this.setState({
      dUniAmount: this.web3.utils.fromWei(_dUniAmount)
    })
  }

  getDNyanUniAllowance = async () => {
    let _dUniAllowance = await this.DarkNyanUniInstance.methods.allowance(this.accounts[0], this.darkNyanInstance._address).call();
    if (_dUniAllowance > 0) {
        this.setState({isApproved: true, allowance: this.web3.utils.fromWei(_dUniAllowance.toString())});
        
    }
    console.log(this.state.allowance);
  }

  getDNyanSupply = async () => {
    let _dNyanSupply = await this.darkNyanInstance.methods.totalSupply().call();
    this.setState({
      totalDNyanUniSupply: this.web3.utils.fromWei(_dNyanSupply)
    })
  }

  approveDNyanUni = async () => {
    if (this.state.isApproving) {
        return;
    }  
    this.setState({isApproving: true});
    
    try {
        let approveStaking = await this.DarkNyanUniInstance.methods.approve(this.darkNyanInstance._address, this.web3.utils.toWei(this.state.totalDNyanUniSupply.toString())).send({
            from: this.accounts[0]
        });
        
        if (approveStaking["status"]) {
            this.setState({isApproving: false, isApproved: true});
        } 
    } catch {
        this.setState({isApproving: false, isApproved: false});
    }
  }

  getDNyanUniStakeAmount = async () => {
    let stakeA = await this.darkNyanInstance.methods.getNipUniStakeAmount(this.accounts[0]).call();
    console.log(stakeA);
    this.setState({stakedAmount: this.web3.utils.fromWei(stakeA)});
  }

  stakeDNyanUni = async () => {
    if (this.state.isStaking || this.state.stakeAmount === 0) {
        return;
    }                        
    this.setState({isStaking: true});
    console.log(this.web3.utils.toWei(this.state.stakeAmount.toString()));
    try {
        let stakeRes = await this.darkNyanInstance.methods.stakeCatnipUni(this.web3.utils.toWei(this.state.stakeAmount.toString())).send({
            from: this.accounts[0]
        });
        if (stakeRes["status"]) {
            this.setState({isStaking: false, stakeAmount: 0});
            this.getDNyanUniStakeAmount();
        }
    } catch (error) {
        this.setState({isStaking: false});
        console.log(error);
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

      console.log(this.web3.eth)

      this.DarkNyanUniInstance = new this.web3.eth.Contract(
        DarkNyanUni,
        "0xdB8C25B309Df6bd93d361ad19ef1C5cE5A667d6A"
      );


      this.darkNyanInstance = new this.web3.eth.Contract(
        DarkNyan.abi,
        "0x23b7f3a35bda036e3b59a945e441e041e6b11101",
      );

      this.getDNyanUniStakeAmount();
      this.getDNyanSupply();
      this.getDNyanUniAllowance();
      this.getDUniAmount();
    //   this.getMyStakeAmount();
    //   this.getCatnipRewards();

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
          <h1>MINE darkNYAN</h1>
            <h3>Create the bridge to the Polkadot network!</h3>

            <div>
                <p>darkNYAN is an extension to the NYAN ecosystem that will allow NYAN voters to acquire non ERC20 assets.</p>
            </div>
            
            <div>
                <p>20% of all minted darkNYAN will go to a funding contract.</p>
            </div>
          
            <div>
                <p>darkNYAN is a rarity. The only way to mint more darkNYAN is to provide liquidity for Catnip. </p>
            </div>

            <div>
              <p>Join the NIP/ETH pool on Uniswap, then stake your pool tokens here.</p>
            </div>
            
            <div className="amount-staked-box">
            <div className="inline-block amount-staked-image">
              <img className="balance-logo-image" alt="nyan logo" src={catnipLogo}/>
              /
              <img className="balance-logo-image" alt="eth logo" src={ethLogo}/>
            </div>
            <div className="inline-block">
              <div className="top-box-desc">Amount in Wallet</div>
    <div className="top-box-val nyan-balance">{this.state.dUniAmount}</div>
            </div>
            <div className="inline-block">
              <div className="top-box-desc">Amount staked</div>
    <div className="top-box-val nyan-balance">{this.state.stakedAmount}</div>
            </div>
          </div>
          <div>
            <input 
            className="input" 
            placeholder="Type in the amount you want to stake or withdraw"
            value={this.setInputField()} 
            onChange={this.updateStakingInput.bind(this)}
            type="number">

            </input>
            </div>

            {!this.state.miningStarted ? <div className="button stake-button">
                {!this.state.isStaking ? <div>MINING HAS NOT STARTED</div> : null}
            </div> : null}
            {!this.state.isApproved && this.state.miningStarted ? <div className="button stake-button" onClick={this.approveDNyanUni}>
                {!this.state.isApproving ? <div>APPROVE</div> : null}
                {this.state.isApproving ? <div>APPROVING...</div> : null}
            </div> : null}
            {this.state.isApproved && this.state.miningStarted ? <div className="button stake-button" onClick={this.stakeDNyanUni}>
                {!this.state.isStaking ? <div>STEP 2: STAKE</div> : null}
                {this.state.isStaking ? <div>STAKING...</div> : null}
            </div> : null}
            {this.state.miningStarted ? <div className="button withdraw-button" onClick={this.withdrawNyan}>
                {!this.state.isWithdrawing ? <div>WITHDRAW</div> : null}
                {this.state.isWithdrawing ? <div>WITHDRAWING...</div> : null}
            </div> : null}
        </div>
      </div>
    );
  }
}
