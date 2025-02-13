import { useEffect, useState, useContext } from "react";

import Coin from "@/components/Coin";
import { useWalletSelector } from '@near-wallet-selector/react-hook';
import { CoinFlipContract } from "@/config";
import styles from "@/styles/app.module.css";


export default function Home() {
	const { signedAccountId, callFunction, viewFunction } = useWalletSelector();
	const [side, setSide] = useState(null);
	const [status, setStatus] = useState("Waiting for user input");
	const [points, setPoints] = useState(0);
	const [choice, setChoice] = useState();

	useEffect(() => {
		if (!signedAccountId) return;
       viewFunction({
			contractId: CoinFlipContract,
			method: "points_of",
			args: { player: signedAccountId },
		}).then((score) => setPoints(score))

	}, [signedAccountId]);

	const handleChoice = async (guess) => {
		setStatus("Asking the contract to flip a coin");
		setChoice(guess);
		setSide("loading");

		let outcome = await callFunction({
			contractId: CoinFlipContract,
			method: "flip_coin",
			args: { player_guess: guess },
		});

		setSide(outcome);
		setStatus(`The outcome was ${outcome}`);

		if (guess === outcome) {
			setStatus("You were right, you won a point!");
			setPoints(points + 1);
		} else {
			setStatus("You were wrong, you lost a point");
			setPoints(points ? points - 1 : 0);
		}
	};

	let color = choice === side ? "btn-success" : "btn-danger";

	return (
		<main className={styles.main}>
			<div className="container">
				{!signedAccountId && (
					<h2 className="text-center">
						<strong>Welcome! Login to Play</strong>
					</h2>
				)}
				<Coin side={side} />
				{signedAccountId && (
					<div className="container mt-5">
						<h2 className="text-center mb-4">
							What do you think is coming next?
						</h2>
						<div className="d-flex justify-content-center">
							<button
								className={`btn me-2 ${choice === "heads" && side !== 'loading' ? color : "btn-primary"
									}`}
								onClick={() => handleChoice("heads")}
							>
								Heads
							</button>
							<button
								className={`btn ${choice === "tails" && side !== 'loading' ? color : "btn-primary"
									}`}
								onClick={() => handleChoice("tails")}
							>
								Tails
							</button>
						</div>
						<p className="mt-3">
							<strong>Status</strong>: {status}
						</p>
						<h3 className="mt-4">
							Your points so far:
							<span className="ms-2 badge bg-secondary">{points}</span>
						</h3>
					</div>
				)}
			</div>
		</main>
	);
}
