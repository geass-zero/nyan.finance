import React, { Component } from "react";

import ethLogo from './assets/eth.png';
import catnipLogo from './assets/catnip.png';

export default class Pump extends Component {
state = {
    loaded: false,
    stakeAmount: 0,
    stakedAmount: 0,
    miningStarted: false,
    isApproved: true,
    isApproving: false,
    isStaking: false,
    isWithdrawing: false,
    darkNyanRewards: 0,
    totalNyanSupply: 0,
    allowance: 0
    };

  handleClick = () => {
    this.props.toggle();
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
              <img className="balance-logo-image" src={catnipLogo}/>
              /
              <img className="balance-logo-image" src={ethLogo}/>
            </div>
            <div className="inline-block">
              <div className="top-box-desc">Amount in Wallet</div>
              <div className="top-box-val nyan-balance">0</div>
            </div>
            <div className="inline-block">
              <div className="top-box-desc">Amount staked</div>
              <div className="top-box-val nyan-balance">0</div>
            </div>
          </div>
          <div>
            <input 
            className="input" 
            placeholder="Type in the amount you want to stake or withdraw"
            // value={this.setInputField()} 
            // onChange={this.updateStakingInput.bind(this)}
            type="number">

            </input>
            </div>

            {!this.state.miningStarted ? <div className="button stake-button">
                {!this.state.isStaking ? <div>MINING HAS NOT STARTED</div> : null}
            </div> : null}
            {this.state.isApproved && this.state.miningStarted ? <div className="button stake-button" onClick={this.stakeNyan}>
                {!this.state.isStaking ? <div>STEP 2: STAKE</div> : null}
                {this.state.isStaking ? <div>STAKING...</div> : null}
            </div> : null}
            {this.miningStarted ? <div className="button withdraw-button" onClick={this.withdrawNyan}>
                {!this.state.isWithdrawing ? <div>WITHDRAW</div> : null}
                {this.state.isWithdrawing ? <div>WITHDRAWING...</div> : null}
            </div> : null}
        </div>
      </div>
    );
  }
}
