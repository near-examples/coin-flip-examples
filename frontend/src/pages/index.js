import Coin from "@/components/Coin";
import { CoinFlipContract } from "@/config";
import { useStore } from "@/layout";
import styles from "@/styles/app.module.css";
import { useEffect, useState } from "react";

export default function Home() {
	const { signedAccountId, wallet } = useStore();
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState(null);
	const [status, setStatus] = useState("Waiting for user input");
	const [points, setPoints] = useState(0);
	const [side, setSide] = useState();

	const [loggedIn, setLoggedIn] = useState(false);
	useEffect(() => {
		setLoggedIn(!!signedAccountId);

		if (signedAccountId) {
			updateScore();
		}
	}, [signedAccountId]);

	const handleChoice = async (side) => {
		setStatus("Asking the contract to flip a coin");
		setSide(side);
		setLoading(true);
		setResult(null);
		let outcome = await wallet.callMethod({
			contractId: CoinFlipContract,
			method: "flip_coin",
			args: { player_guess: side },
		});
		setLoading(false);
		setResult(outcome);
		setStatus(`The outcome was ${outcome}`);

		if (outcome === side) {
			setStatus("You were right, you win a point!");
		} else {
			setStatus("You were wrong, you lost a point");
		} 

		updateScore();
	};

	const updateScore = async () => {
		
		const score = await wallet.viewMethod({
			contractId: CoinFlipContract,
			method: "points_of",
			args: { player: signedAccountId },
		});

		setPoints(score);
	};
	let color = result === side ? "btn-success" : "btn-danger";

	return (
		<main className={styles.main}>
			<div className="container">
				{loggedIn || (
					<h1 className="text-center">
						<strong>Welcome! Login to Play</strong>
					</h1>
				)}
				<Coin loading={loading} result={result} />
				{loggedIn && (
					<div className="container mt-5">
						<h2 className="text-center mb-4">
							What do you think is coming next?
						</h2>
						<div className="d-flex justify-content-center">
							<button
								className={`btn me-2 ${
									side == "heads" && result ? color : "btn-primary"
								}`}
								onClick={() => handleChoice("heads")}
							>
								Heads
							</button>
							<button
								className={`btn ${
									side == "tails" && result ? color : "btn-primary"
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
							Your points so far:{" "}
							<span className="badge bg-secondary">{points}</span>
						</h3>
					</div>
				)}
			</div>
		</main>
	);
}
