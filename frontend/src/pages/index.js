import { useEffect, useState } from "react";

import Coin from "@/components/Coin";
import { useNearWallet } from 'near-connect-hooks';
import { CoinFlipContract } from "@/config";
import styles from "@/styles/app.module.css";


export default function Home() {
	const { signedAccountId, callFunction, viewFunction } = useNearWallet();
	const [side, setSide] = useState(null);
	const [status, setStatus] = useState({ text: "Pick a side to flip the coin", tone: "secondary" });
	const [points, setPoints] = useState(0);
	const [choice, setChoice] = useState();

	const flipping = side === "loading";

	useEffect(() => {
		if (!signedAccountId) return;
		viewFunction({
			contractId: CoinFlipContract,
			method: "points_of",
			args: { player: signedAccountId },
		}).then((score) => setPoints(score))

	}, [signedAccountId]);

	const handleChoice = async (guess) => {
		setStatus({ text: "Asking the contract to flip a coin...", tone: "secondary" });
		setChoice(guess);
		setSide("loading");

		let outcome = await callFunction({
			contractId: CoinFlipContract,
			method: "flip_coin",
			args: { player_guess: guess },
		});

		setSide(outcome);

		if (guess === outcome) {
			setStatus({ text: `It was ${outcome}. You won a point!`, tone: "success" });
			setPoints((p) => p + 1);
		} else {
			setStatus({ text: `It was ${outcome}. You lost a point`, tone: "danger" });
			setPoints((p) => (p ? p - 1 : 0));
		}
	};

	const guessColor = choice === side ? "btn-success" : "btn-danger";
	const buttonClass = (guess) =>
		choice === guess && !flipping && side ? guessColor : "btn-primary";

	return (
		<main className={styles.main}>
			<Coin side={side} />

			{!signedAccountId ? (
				<div className="text-center mt-5">
					<h1 className="fs-2 fw-bold">Heads or tails?</h1>
					<p className="text-body-secondary mb-0">
						Log in with your NEAR wallet, guess the flip, earn points.
					</p>
				</div>
			) : (
				<div className="text-center mt-5 w-100">
					<h1 className="fs-2 fw-bold mb-4">What is coming next?</h1>
					<div className="d-flex gap-3 justify-content-center">
						<button
							className={`btn btn-lg px-4 ${buttonClass("heads")}`}
							disabled={flipping}
							onClick={() => handleChoice("heads")}
						>
							Heads
						</button>
						<button
							className={`btn btn-lg px-4 ${buttonClass("tails")}`}
							disabled={flipping}
							onClick={() => handleChoice("tails")}
						>
							Tails
						</button>
					</div>
					<p className={`mt-4 mb-1 fw-medium text-${status.tone}`} role="status">
						{status.text}
					</p>
					<p className="text-body-secondary">
						Your points: <strong className="text-body">{points}</strong>
					</p>
				</div>
			)}
		</main>
	);
}
