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
	const [allWaves, setAllWaves] = useState([]);
	const [isLoading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	const contractAddress = "0xfF830Cb36DFc8f636e97B1b9BF484F2AfFC32422";
	const contractABI = abi.abi;

	useEffect(() => {
		checkIfWalletIsConnected();
		getAllWaves();
		// eslint-disable-next-line
	}, [])

	useEffect(() => {
		if(currentAccount !== "") {
			getWaveCount();		
		}	
		// eslint-disable-next-line
	}, [currentAccount])

	useEffect(() => {
		let wavePortalContract;
	  
		const onNewWave = (from, timestamp, message) => {
		  console.log('NewWave', from, timestamp, message);
		  setAllWaves(prevState => [
			...prevState,
			{
			  address: from,
			  timestamp: new Date(timestamp * 1000),
			  message: message,
			},
		  ]);
		};
	  
		if (window.ethereum) {
		  const provider = new ethers.providers.Web3Provider(window.ethereum);
		  const signer = provider.getSigner();
	  
		  wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
		  wavePortalContract.on('NewWave', onNewWave);
		}
	  
		return () => {
		  if (wavePortalContract) {
			wavePortalContract.off('NewWave', onNewWave);
		  }
		};
		// eslint-disable-next-line
	  }, []);

	const getAllWaves = async () => {
		try {
		  const { ethereum } = window;
		  if (ethereum) {
			const provider = new ethers.providers.Web3Provider(ethereum);
			const signer = provider.getSigner();
			const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
	
			/*
			 * Call the getAllWaves method from your Smart Contract
			 */
			const waves = await wavePortalContract.getAllWaves();
			
	
			/*
			 * We only need address, timestamp, and message in our UI so let's
			 * pick those out
			 */
			let wavesCleaned = [];
			waves.forEach(wave => {
			  wavesCleaned.push({
				address: wave.waver,
				timestamp: new Date(wave.timestamp * 1000),
				message: wave.message
			  });
			});
	
			/*
			 * Store our data in React State
			 */
			console.log('Got Waves', wavesCleaned)
			setAllWaves(wavesCleaned.reverse());
		  } else {
			console.log("Ethereum object doesn't exist!")
		  }
		} catch (error) {
		  console.log(error);
		}
	  }
	
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
				const waveTxn = await wavePortalContract.wave(message, { gasLimit: 300000 });
				setMessage("")
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
				AJ's Wave Portal!
				<div>よおこそ。将来は今です。</div>
				{!currentAccount && (
					<div>
						<Button className="button" onClick={connectWallet}>
							Connect
						</Button>
					</div>
				)}
			</div>
			<div>
								<div className="app__inputContainer">
					<input value={message} onChange={(e) => setMessage(e.target.value)} className="app__input" placeholder="Say Hi!"/>
				</div>
				<div className="app__buttonContainer">
					<Button className="button" disabled={!currentAccount} onClick={wave} isLoading={isLoading}>
						Wave
					</Button>
				</div>
				<div className="app__cooldownMsg">(30 sec cooldown)</div>
			</div>
			<div>
			<div>Wave count: {waveCount}</div>
			{allWaves.map((wave, index) => {
					return (
						<div key={index} className="app__waves">
							<div>Address: {wave.address}</div>
							<div>Time: {wave.timestamp.toString()}</div>
							<div>Message: <span className="app__waveMessage">{wave.message}</span></div>
						</div>
					)
				})}
			</div>
			<div className="app_bulidspace">
				Built following a <a href="https://buildspace.so" target="_blank" rel="noreferrer" className="App-link">BuildSpace</a> project.
			</div>
				
			
			
		</div>
	);
}

export default App;
