import { useState } from "react";
import './App.css';

const NETWORK = 'livenet'
const RECIPIENT_ADDRESS = 'bc1pquarvx4j8tn8594j204zphpzwdfndealmqnxztd3xp4qx53k3eesmkxv0l'
const INSCRIPTION_ID = 'e3452dbdfd1cee654571fba827d455611b33623b29d9f9d94b7ebb4fccaf52dfi0'
const FEE_RATE = 30

function App() {
	const [address, setAddress] = useState(null)
	const [publicKey, setPublicKey] = useState(null)

	const init = async () => {
		if (window.unisat) {
			window.unisat.on('accountsChanged', async (accounts) => {
				const currentNetwork = await window.unisat.getNetwork(NETWORK)

				if (currentNetwork === NETWORK) {
					setAddress(accounts[0])
					setPublicKey(await window.unisat.getPublicKey())
				} else {
					setAddress(null)
					setPublicKey(null)
				}
			});

			const currentNetwork = await window.unisat.getNetwork(NETWORK)

			if (currentNetwork === NETWORK) {
				const accounts = await window.unisat.getAccounts()

				if (accounts.length) {
					setAddress(accounts[0])
					setPublicKey(await window.unisat.getPublicKey())
				}
			}
		}
	}

	init()

	const connectWallet = async () => {
		try {
			if (!window.unisat) {
				alert('UniSat wallet not installed!');
				return
			}

			await window.unisat.switchNetwork(NETWORK)

			const accounts = await window.unisat.requestAccounts()

			setAddress(accounts[0])
			setPublicKey(await window.unisat.getPublicKey())
		} catch (error) {
			console.error(JSON.stringify(error))
			alert(JSON.stringify(error))
		}
	}

	const sendBitcoin = async () => {
		try {
			const txid = await window.unisat.sendBitcoin(RECIPIENT_ADDRESS, 1000, {
				feeRate: FEE_RATE,
			})

			if (txid) {
				console.log(txid)
			} else {
				alert('Error')
			}
		} catch (error) {
			console.error(JSON.stringify(error))
			alert(JSON.stringify(error))
		}
	}

	const sendInscription = async () => {
		try {
			const txid = await window.unisat.sendInscription(RECIPIENT_ADDRESS, INSCRIPTION_ID, {
				feeRate: FEE_RATE,
			})

			if (txid) {
				console.log(txid)
			} else {
				alert('Error')
			}
		} catch (error) {
			console.error(JSON.stringify(error))
			alert(JSON.stringify(error))
		}
	}

	const signMessage = async () => {
		try {
			const message = 'Hello World'

			const signature = await window.unisat.signMessage(message)
			console.log(signature)
		} catch (error) {
			console.error(JSON.stringify(error))
			alert(JSON.stringify(error))
		}
	}

	return (
		<>
			{(!address) && (<button onClick={connectWallet}>Connect Wallet</button>)}
			{(address) && (
				<>
					<>Address: {address}</><br />
					<>Public Key: {publicKey}</><br />
					<br />
					<button onClick={sendBitcoin} >Send Bitcoin</button>
					<button onClick={sendInscription} >Send Inscription</button>
					<button onClick={signMessage} >Sign Message</button>
				</>
			)}
		</>
	);
}

export default App;
