import React, {useState, useEffect} from 'react';
import SwapForm from './swapForm';
import {useRouter} from 'next/router';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import InfoIcon from '@material-ui/icons/Info';
import {web3, atari, fantom, weth,routerAddress, factoryContract, exchangeContract, atariContract, fantomContract, gasLimitHex, PairAbi} from './abi/contract';

function LiquidityCard(){
    const router = useRouter();
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
        console.log("hahaha")
        setToken1(token2);
        setToken2(token1);
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

    const handleAmount1 = async (e)=>{
        setAmount1(e.target.value);
        var dex1;
        if(token1=="Ether")
            dex1=18;
        else
            dex1=9;
            console.log("I want to sleep")
        if(e.target.value>0&&token1!=token2){
            console.log("I want to eat")
            var data1 = await factoryContract.methods.getPair(tokenAddress1, tokenAddress2).call();
            var pairContract = new web3.eth.Contract(PairAbi, data1);
            var pairData1 = await pairContract.methods.getReserves().call();
            var token10 = await pairContract.methods.token0().call();
            console.log("tokenAddress1", tokenAddress1, "token10", token10, "pairData0", pairData1[0], "pairData1", pairData1[1])
            if(token10.toUpperCase()==tokenAddress1.toUpperCase()){
                setAmount2((pairData1[1]/pairData1[0]*e.target.value).toFixed(10));
            }
            else{
                setAmount2((pairData1[0]/pairData1[1]*e.target.value).toFixed(10));
            }
        }
    }
    const handleAmount2 = async (e)=>{
        setAmount2(e.target.value);
        var dex2;
        if(token2=="Ether")
            dex2=18;
        else
            dex2=9;
            
        if(e.target.value>0&&token1!=token2){
            var data2 = await factoryContract.methods.getPair(tokenAddress1, tokenAddress2).call();
            var pairContract = new web3.eth.Contract(PairAbi, data2);
            var pairData2 = await pairContract.methods.getReserves().call();
            var token20 = await pairContract.methods.token0().call();
            if(token1=="Ether")
                dex2=18;
            else
                dex2=9;
            if(token20==tokenAddress2){
                setAmount1((Math.pow(10,-dex2)*pairData2[0]/pairData2[1]*e.target.value).toFixed(10));
            }
            else{
                setAmount1((Math.pow(10,-dex2)*pairData2[1]/pairData2[0]*e.target.value).toFixed(10));
            }
        }
    }

    const handleLiquidity =  () =>{
        if(token1=="Ether"||token2=="Ether")
            addLiquidityETH();
        else addLiquidityTokens();
    }

    const addLiquidityETH = async () =>{
        setLoading(true);
    
         //swap
         var tokenAddress,tokenContract, amountToken,amountETH;
         if(token1=="Ether"){
            tokenAddress=token2=="Atari"?atari:fantom;
            tokenContract=token2=="Atari"?atariContract:fantomContract;
            amountToken=amount2;
            amountETH=amount1;
         }
         else{
            tokenAddress=token1=="Atari"?atari:fantom;
            tokenContract=token1=="Atari"?atariContract:fantomContract;
            amountToken=amount1;
            amountETH=amount2;
         }

         console.log(amountETH);
    
         
         var date=new Date();
         var seconds = Math.floor(date.getTime() / 1000)+1000000;
    
        //approve token
        var Data=await tokenContract.methods.approve(routerAddress,amountToken*Math.pow(10,9)).encodeABI();
        var Txdetail = {
                    from: window.ethereum.selectedAddress,
                    to: tokenAddress,
                    value: web3.utils.toHex(web3.utils.toWei("0")),
                    gas: web3.utils.toHex(210000),
                    gasPrice: web3.utils.toHex(web3.utils.toWei('50', 'gwei')),
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
    
                                    //addliquidity
                                    console.log(web3.utils.toWei(amountETH.toString()),tokenAddress,window.ethereum.selectedAddress,seconds);
                                    var Data=await exchangeContract.methods.addLiquidityETH( tokenAddress,amountToken*Math.pow(10,9),0,0,window.ethereum.selectedAddress,seconds).encodeABI();
    
                                    var Txdetail = {
                                                from: window.ethereum.selectedAddress,
                                                to: routerAddress,
                                                value: web3.utils.toHex(web3.utils.toWei(amountETH.toString(),"Ether")),
                                                gas: web3.utils.toHex(4000000),
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
                            });	
                        }
    });
    }
    const addLiquidityTokens = async () =>{
        setLoading(true);
         //swap
         var path=[];
         path[0]=token1=="Atari"?atari:fantom;
         path[1]=token2=="Atari"?atari:fantom;
    
         var tokenAddress1=token1=="Atari"?atari:fantom;
         var tokenContract1=token1=="Atari"?atariContract:fantomContract;
    
         var tokenAddress2=token2=="Atari"?atari:fantom;
         var tokenContract2=token2=="Atari"?atariContract:fantomContract;
         
         var date=new Date();
         var seconds = Math.floor(date.getTime() / 1000)+1000000;
    
        //approve token
        var Data=await tokenContract1.methods.approve(routerAddress,amount1*Math.pow(10,9)).encodeABI();
        var Txdetail = {
                    from: window.ethereum.selectedAddress,
                    to: tokenAddress1,
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
                                var Data=await tokenContract2.methods.approve(routerAddress,amount2*Math.pow(10,9)).encodeABI();
    
                                var Txdetail = {
                                        from: window.ethereum.selectedAddress,
                                        to: tokenAddress2,
                                        value: web3.utils.toHex(web3.utils.toWei("0")),
                                        gas: web3.utils.toHex(210000),
                                        gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
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
                                                    
                                                    //addliquidity
    
                                                    console.log(web3.utils.toWei(amount1.toString()),path,window.ethereum.selectedAddress,seconds);
                                                    var Data=await exchangeContract.methods.addLiquidity( path[0],path[1],amount1*Math.pow(10,9),amount2*Math.pow(10,9),0,0,window.ethereum.selectedAddress,seconds).encodeABI();
                                                    
                                                    var Txdetail = {
                                                                from: window.ethereum.selectedAddress,
                                                                to: routerAddress,
                                                                value: web3.utils.toHex("0"),
                                                                gas: web3.utils.toHex(4000000),
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
    
                            }});
                        }
    
    });
    }
    return(
        <div className = "x-swapCard-container" style = {screenWidth>800?{paddingLeft:"70px", paddingRight: "70px"}:{paddingRight: "10px", paddingLeft: "10px"}}>
            <div className = "x-font1 text-center">
                <span className = "float-left">
                    <IconButton color="primary" aria-label="upload picture" component="span">
                        <ArrowBackIcon style = {{color: "white"}} onClick = {()=>router.back()}/>
                    </IconButton>
                </span>
                <span className = "x-font1">Add Liquidity</span>
                <span className = "float-right">
                    <IconButton color="primary">
                        <InfoIcon style = {{color: "white"}}/>
                    </IconButton>
                </span>
            </div>
            <SwapForm role = "Input" handleToken = {handleToken1} flag = {flag1} setFlag = {setFlag1} token = {token1} handleAmount = {handleAmount1} amount = {amount1}/>
            <div className = "text-center mt-5 mb-5">
                <IconButton color="primary" aria-label="upload picture" component="span">
                    <ArrowDownwardIcon style = {{color: "white"}} onClick = {handleReverse}/>
                </IconButton>
            </div>
            <SwapForm handleToken = {handleToken2} flag = {flag2} setFlag = {setFlag2} token = {token2} handleAmount = {handleAmount2} amount = {amount2}/>
            <div className = "mt-5">
                <button className = "x-swapCard-submit-button" onClick = {handleLiquidity}>{loading?<img src = "/img/loading.gif" />: "Enter an amount"}</button>
            </div>
        </div>
    )
}

export default LiquidityCard;