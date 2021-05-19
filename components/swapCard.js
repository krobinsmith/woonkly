import React, {useEffect, useState} from 'react';
import SwapForm from './swapForm';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import IconButton from '@material-ui/core/IconButton';
import {web3, atari, fantom, weth,routerAddress, factoryContract, exchangeContract, atariContract, fantomContract, gasLimitHex, PairAbi, factoryAddress} from './abi/contract';

var BN = web3.utils.BN

function SwapCard(){
    const [flag1, setFlag1] = useState(true);
    const [token1, setToken1] = useState("Ether");
    const [flag2, setFlag2] = useState(true);
    const [token2, setToken2] = useState("Ether");
    const [tokenAddress1, setTokenAddress1] = useState("0xc778417e063141139fce010982780140aa0cd5ab");
    const [tokenAddress2, setTokenAddress2] = useState("0xc778417e063141139fce010982780140aa0cd5ab");
    const [amount1, setAmount1] = useState();
    const [amount2, setAmount2] = useState();
    const [loading, setLoading] = useState(false);
    const [screenWidth, setScreenWidth] = useState();

    useEffect(()=>{
        if (typeof window !== 'undefined') {
            setScreenWidth(window.innerWidth);
          }
    })

    const handleReverse = () =>{
        setToken1(token2);
        setToken2(token1);
    }
    const handleEthForToken = async () =>{
        setLoading(true);
		 //swap
		 var path=[];
		 path[0]=weth;
		 path[1]=token2=="Atari"?atari:fantom;
		 
		 var date=new Date();
		 var seconds = Math.floor(date.getTime() / 1000)+1000000;

		console.log("ETHER to token",web3.utils.toWei(amount1.toString()),path,window.ethereum.selectedAddress,seconds);
		 var Data=await exchangeContract.methods.swapExactETHForTokens(0,path,window.ethereum.selectedAddress,seconds).encodeABI();
		var Txdetail = {
				from: window.ethereum.selectedAddress,
				to: routerAddress,
				value: web3.utils.toHex(web3.utils.toWei(amount1.toString(),"ether")),
				gas: web3.utils.toHex(210000),
				gasPrice: web3.utils.toHex(web3.utils.toWei('50', 'gwei')),
				data:Data
				}
		window.ethereum.request({ method: 'eth_sendTransaction', params: [Txdetail] }).then(async (res) => {
			console.log(res);
			var ethFlag = true;
			while(ethFlag){
			await web3.eth.getTransactionReceipt(res, (error, receipt) => {
					if (error) {
						console.log(error)
						alert("stake failed");
					} else if (receipt == null) {
							console.log("repeat")
					} else {
						console.log("confirm", receipt);
						ethFlag = false;
                        setLoading(false);
					}
				});
			}
		});
    }
    const handleTokenForEth = async () =>{
        setLoading(true);
		 //swap
		 var path=[];
		 path[0]=token1=="Atari"?atari:fantom;
		 path[1]=weth;

		 var tokenAddress=token1=="Atari"?atari:fantom;
		 var tokenContract=token1=="Atari"?atariContract:fantomContract;
		 
		 var date=new Date();
		 var seconds = Math.floor(date.getTime() / 1000)+1000000;

		//approve token
		var Data=await tokenContract.methods.approve(routerAddress,web3.utils.toWei(amount1.toString())).encodeABI();
		var Txdetail = {
					from: window.ethereum.selectedAddress,
					to: tokenAddress,
					value: web3.utils.toHex(web3.utils.toWei("0")),
					gas: web3.utils.toHex(210000),
					gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei')),
					data:Data
				}

		window.ethereum.request({ method: 'eth_sendTransaction', params: [Txdetail] }).then(async (res) => {
			console.log(res);
			var ethFlag = true;
			while(ethFlag){
				await web3.eth.getTransactionReceipt(res,async (error, receipt) => {
					if (error) {
						console.log(error)
					} else if (receipt == null) {
							console.log("repeat")
					} else {
						console.log("confirm", receipt)
						ethFlag = false;
						
						console.log(web3.utils.toWei(amount1.toString()),path,window.ethereum.selectedAddress,seconds);
						var Data=await exchangeContract.methods.swapExactTokensForETH(web3.utils.toWei(amount1.toString()),0,path,window.ethereum.selectedAddress,seconds).encodeABI();
						
						var Txdetail = {
									from: window.ethereum.selectedAddress,
									to: routerAddress,
									value: web3.utils.toHex("0"),
									gas: web3.utils.toHex(210000),
									gasPrice: web3.utils.toHex(web3.utils.toWei('50', 'gwei')),
									data:Data
								}
						window.ethereum.request({ method: 'eth_sendTransaction', params: [Txdetail] }).then(async (res) => {
							console.log(res);
							var ethFlag = true;
							while(ethFlag){
								await web3.eth.getTransactionReceipt(res, (error, receipt) => {
									if (error) {
										console.log(error)
										alert("stake failed");
									} else if (receipt == null) {
											console.log("repeat")
									} else {
										console.log("confirm", receipt);
										ethFlag = false;
                                        setLoading(false);
									}
								});
								}
						});
				
				}
			})
		}
		
		});
    }
    const handleTokenForToken = async () =>{
        setLoading(true);
		 //swap
		 var path=[];
		 path[0]=token1=="Atari"?atari:fantom;
		 path[1]=token2=="Atari"?atari:fantom;

		 var tokenAddress=token1=="Atari"?atari:fantom;
		 var tokenContract=token1=="Atari"?atariContract:fantomContract;
		 
		 var date=new Date();
		 var seconds = Math.floor(date.getTime() / 1000)+1000000;

		//approve token
		var Data=await tokenContract.methods.approve(routerAddress,amount1*Math.pow(10,9)).encodeABI();
		var Txdetail = {
					from: window.ethereum.selectedAddress,
					to: tokenAddress,
					value: web3.utils.toHex(web3.utils.toWei("0")),
					gas: web3.utils.toHex(210000),
					gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei')),
					data:Data
				}

		window.ethereum.request({ method: 'eth_sendTransaction', params: [Txdetail] }).then(async (res) => {
			console.log(res);
			var ethFlag = true;
			while(ethFlag){
				await web3.eth.getTransactionReceipt(res,async (error, receipt) => {
					if (error) {
						console.log(error)
					} else if (receipt == null) {
							console.log("repeat")
					} else {
						console.log("confirm", receipt)
						ethFlag = false;
						
						console.log(web3.utils.toWei(amount1.toString()),path,window.ethereum.selectedAddress,seconds);
						var Data=await exchangeContract.methods.swapExactTokensForTokens(amount1*Math.pow(10,9),0,path,window.ethereum.selectedAddress,seconds).encodeABI();
						
						var Txdetail = {
									from: window.ethereum.selectedAddress,
									to: routerAddress,
									value: web3.utils.toHex("0"),
									gas: web3.utils.toHex(210000),
									gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei')),
									data:Data
								}
						window.ethereum.request({ method: 'eth_sendTransaction', params: [Txdetail] }).then(async (res) => {
							console.log(res);
							var ethFlag = true;
							while(ethFlag){
								await web3.eth.getTransactionReceipt(res, (error, receipt) => {
									if (error) {
										console.log(error)
										alert("stake failed");
									} else if (receipt == null) {
											console.log("repeat")
									} else {
										console.log("confirm", receipt);
										ethFlag = false;
                                        setLoading(false);
									}
								});
								}
						});
				
				}
			})
		}
		
		});
    }
    const handleSwap = () =>{

        if(token1==token2) {
            alert("input same token!");
            return;
        }

        console.log(token1,token2);
        if(token1=="Ether")
            {
                console.log("ether transaction");
                handleEthForToken();
            }
            else{
                if(token2=="Ether"){
                    handleTokenForEth();
                }
                else {
                    handleTokenForToken();
                }	
            }
    }

    const handleAmount1 = async (e)=>{
        setAmount1(e.target.value);
        var dex1;
        if(token1=="Ether")
            dex1=18;
        else
            dex1=9;
        if(e.target.value>0&&token1!=token2){
            console.log(tokenAddress1);
            var pairData1 = await exchangeContract.methods.getAmountsOut(web3.utils.toBN(Math.floor((e.target.value*Math.pow(10,dex1)))), [tokenAddress1, tokenAddress2]).call();
            if(token2=="Ether")
                dex1=18;
            else
                dex1=9;
                console.log(pairData1);
            setAmount2((Math.pow(10,-dex1)*pairData1[1]).toFixed(10));
        }
    }

    const handleAmount2 = async (e)=>{
        console.log(e.target.value);
        setAmount2(e.target.value);
        var dex2;
        if(token2=="Ether")
            dex2=18;
        else
            dex2=9;
        
        if(e.target.value>0 && token1!=token2){
            var pairData2 = await exchangeContract.methods.getAmountsIn(web3.utils.toBN(Math.floor((e.target.value*Math.pow(10,dex2)))), [tokenAddress1, tokenAddress2]).call();
            console.log(pairData2);
            if(token1=="Ether")
                dex2=18;
            else
                dex2=9;
            setAmount1((Math.pow(10,-dex2)*pairData2[0]).toFixed(10));
        }
    }

    const handleToken1 = (e,v) =>{
        setToken1(v);
        if(v=="Atari")
            setTokenAddress1(atari);
        if(v=="Fantom")
            setTokenAddress1(fantom);
        if(v=="Ether")
            setTokenAddress1(weth);
        setFlag1(true);

    }
    const handleToken2 = (e,v) =>{
        setToken2(v);
        if(v=="Atari")
            setTokenAddress2(atari);
        if(v=="Fantom")
            setTokenAddress2(fantom);
        if(v=="Ether")
            setTokenAddress2(weth);
        setFlag2(true);
    }
    return(
        <div className = "x-swapCard-container" style = {screenWidth>800?{paddingLeft:"70px", paddingRight: "70px"}:{paddingRight: "10px", paddingLeft: "10px"}}>
            <div className = "x-font1 text-center">
                Swap
            </div>
            <div className = "x-font2 text-center mb-5">
                Metamask Connected
            </div>
            <SwapForm role = "From" handleToken = {handleToken1} flag = {flag1} setFlag = {setFlag1} token = {token1} handleAmount = {handleAmount1} amount = {amount1}/>
            <div className = "text-center mt-5 mb-3">
                <IconButton color="primary" aria-label="upload picture" component="span" onClick = {handleReverse}>
                    <ArrowDownwardIcon style = {{color: "white"}}/>
                </IconButton>
            </div>
            <SwapForm role = "To" handleToken = {handleToken2} flag = {flag2} setFlag = {setFlag2} token = {token2} handleAmount = {handleAmount2} amount = {amount2}/>
            <div className = "mt-5">
                <button className = "x-swapCard-submit-button" onClick = {handleSwap}>{loading?<img src = "/img/loading.gif" />:"Swap"}</button>
            </div>
        </div>
    )
}

export default SwapCard;