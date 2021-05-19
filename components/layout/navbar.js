import React, {useEffect, useState} from 'react';
import {Navbar, Form} from 'react-bootstrap';
import {Button} from '@material-ui/core';
import Web3 from 'web3';


function Navigation(){
    const [flag, setFlag] = useState(false);

    useEffect(async()=>{
        var web3 = new Web3();
        web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        if(accounts.length==0){
            setFlag(false)
        }
        else
            setFlag(true);
    })
    const handleConnect = () =>{
        console.log("connect");
            if (window.ethereum) {
                console.log("good");
                window.ethereum.enable().then((res)=> {
                    setFlag(true);
                })
                }
            else{
                alert("you have to install metamask!")
            }
    }
    return(
        <div className = "x-nav-container">
            <div className = "diceGrid">
                <Navbar.Brand href="/"><img src = "/img/logo.png" alt = "logo" width = "120px"/></Navbar.Brand>
                <Button variant="contained" className = "x-nav-button" onClick = {handleConnect}>{flag?"Connected":"connect"}</Button>
            </div>
        </div>
    )
}

export default Navigation;