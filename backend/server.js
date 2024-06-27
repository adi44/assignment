const express = require('express');
const {Web3} = require('web3');
const app = express();

var jsonParser = express.json();

const ABI = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "__message",
          "type": "string"
        }
      ],
      "stateMutability": "payable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "when",
          "type": "uint256"
        }
      ],
      "name": "Withdrawal",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "message",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "__message",
          "type": "string"
        }
      ],
      "name": "setMessage",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]


const ADDRESS = '0x9766cde305caf1da70bcdd2c340a62f15a9716ae';

const initalizeContract = async () => {
    const web3 = new Web3('https://rpc-amoy.polygon.technology')
    const contract = new web3.eth.Contract(ABI, ADDRESS);
    // import account from private key
    const account = web3.eth.accounts.privateKeyToAccount("0xac770e3c5576dcfaaf5e3558580855dbafcaf54848732764eca96aefe578fb2b");
    console.log('Contract initalized');
    return {web3, contract, account };
};

app.get('/', (req, res) => {
    res.send('Hello World!');
    });

app.get("/api/message", async (req, res) => {
    const { contract } = await initalizeContract();
    const message = await contract.methods.message().call()
    res.send({ message });
});

app.post("/api/message", jsonParser, async (req, res) => {
    const { web3, contract, account } = await initalizeContract();
    const message = req.body.message;
    const tx = contract.methods.setMessage(message);
    const gas = await tx.estimateGas();
    const gasPrice = await web3.eth.getGasPrice();
    const data = tx.encodeABI();
    const nonce = await web3.eth.getTransactionCount(account.address);
    const signedTx = await account.signTransaction({
        to: ADDRESS,
        from: account.address,
        data,
        gas,
        gasPrice,
        nonce
    });
    res.send({ signedTx });
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});