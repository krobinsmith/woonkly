import Web3 from 'web3';
import exchangeAbi from './exchange.json';
import factoryAbi from './factory.json';
import tokenAbi from './token.json';
import pairAbi from './pair.json';


export const testnet = `https://ropsten.infura.io/v3/3faf86d257c44a17aa5f284af7582176`;
export var web3 = new Web3(new Web3.providers.HttpProvider(testnet));
export var factoryAddress = "0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f";
export var routerAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
export var atari = "0x04cB0F0004b00d567A94D9358C91207982ED164C";
export var fantom = "0xDcCCaa5687C59a9b374fAaC4faF86f6575897268";
export var weth="0xc778417e063141139fce010982780140aa0cd5ab";
export var factoryContract =new web3.eth.Contract(factoryAbi, factoryAddress);
export var exchangeContract= new web3.eth.Contract(exchangeAbi,routerAddress);
export var atariContract= new web3.eth.Contract(tokenAbi,atari);
export var fantomContract= new web3.eth.Contract(tokenAbi,fantom);
export const gasLimitHex = web3.utils.toHex(2200000);
export const PairAbi = pairAbi;
