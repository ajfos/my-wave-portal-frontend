import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";
import './App.scss';
import abi from './Utils/WavePortal.json';
import Button from './Button';

function App() {
	/*
	* Just a state variable we use to store our user's public wallet.
	*/
	const [currentAccount, setCurrentAccount] = useState("");
	const [waveCount, setWaveCount] = useState(0);
	const [isLoading, setLoading] = useState(false);

	const contractAddress = "0x8b3de83dfb9b49c810c6792acb43d265bf8d68c2";
	const contractABI = abi.abi;

	useEffect(() => {
		checkIfWalletIsConnected();
	}, [])

	useEffect(() => {
		if(currentAccount !== "") {
			getWaveCount();
		}	
		// eslint-disable-next-line
	}, [currentAccount])
	
	const checkIfWalletIsConnected = async () => {
		try {
			const { ethereum } = window;
			
			if (!ethereum) {
				console.log("Make sure you have metamask!");
				return;
			} else {
				console.log("We have the ethereum object", ethereum);
			}
			
			/*
			* Check if we're authorized to access the user's wallet
			*/
			const accounts = await ethereum.request({ method: 'eth_accounts' });
			
			if (accounts.length !== 0) {
				const account = accounts[0];
				console.log("Found an authorized account:", account);
				setCurrentAccount(account);
			} else {
				console.log("No authorized account found")
			}
		} catch (error) {
			console.log(error);
		}
	}

	/**
	* Implement your connectWallet method here
	*/
	 const connectWallet = async () => {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				alert("Get MetaMask!");
				return;
			}

			const accounts = await ethereum.request({ method: "eth_requestAccounts" });

			console.log("Connected", accounts[0]);
			setCurrentAccount(accounts[0]); 
		} catch (error) {
			console.log(error)
		}
	}

	const wave = async () => {
		setLoading(true);
		try {
			const { ethereum } = window;
		
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
		
				let count = await wavePortalContract.getTotalWaves();
				console.log("Retrieved total wave count...", count.toNumber());
		
				/*
				* Execute the actual wave from your smart contract
				*/
				const waveTxn = await wavePortalContract.wave();
				console.log("Mining...", waveTxn.hash);
		
				await waveTxn.wait();
				console.log("Mined -- ", waveTxn.hash);
		
				count = await wavePortalContract.getTotalWaves();
				console.log("Retrieved total wave count...", count.toNumber());
				setWaveCount(count.toNumber());
			} else {
				console.log("Ethereum object doesn't exist!");
			}
		} catch (error) {
		  	console.log(error)
		}
		setLoading(false);
	}

	const getWaveCount = async () => {
		try {
			const { ethereum } = window;
		
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
		
				let count = await wavePortalContract.getTotalWaves();
				console.log("Retrieved total wave count...", count.toNumber());
				setWaveCount(count.toNumber());
			} else {
				console.log("Ethereum object doesn't exist!");
			}
		} catch (error) {
		  	console.log(error)
		}
	}
	


	return (
		<div className="App">
			<div className="app__title">
				<img src={'https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/31987/eth-diamond-black.png'} className="App-logo" alt="logo" />
				AJ's Wave Portal Frontend!
				{!currentAccount && (
					<div>
						<Button className="button" onClick={connectWallet}>
							Connect
						</Button>
					</div>
				)}
			</div>
			<div>
				
				<div>Wave count: {waveCount}</div>
				<div>
					<Button className="button" disabled={!currentAccount} onClick={wave} isLoading={isLoading}>
						Wave
					</Button>
				</div>
			</div>
				<div>
					Built following a <a href="https://buildspace.so" target="_blank" rel="noreferrer" className="App-link">BuildSpace</a> project.
				</div>
				
			
			
		</div>
	);
}

export default App;
