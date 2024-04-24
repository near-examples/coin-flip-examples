import { CoinFlipContract } from "@/config";
import { useStore } from "@/layout";
import { useState } from "react";

const CoinGame = () => {
    const { wallet } = useStore();
    const [status, setStatus] = useState('Waiting for user input');
    const [points, setPoints] = useState(0);

    const handleChoice = async (side) => {

        setStatus("Asking the contract to flip a coin");
        let outcome = await wallet.callMethod({
            contractId: CoinFlipContract,
            method: 'flip_coin',
            args: { player_guess: side }
        });
        setStatus(`The outcome was ${outcome}`);
        if (outcome === side) {
            setStatus("You were right, you win a point!")
        } else {
            setStatus("You were wrong, you lost a point")
        }

        const score = await wallet.viewMethod({
            contractId: CoinFlipContract,
            method: 'points_of',
            args: { player: wallet.accountId }
          });

          setPoints(score)
    };



    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">What do you think is coming next?</h2>
            <div className="d-flex justify-content-center">
                <button className="btn btn-primary me-2" onClick={() => handleChoice('heads')}>Heads</button>
                <button className="btn btn-primary" onClick={() => handleChoice('tails')}>Tails</button>
            </div>
            <p className="mt-3"><strong>Status</strong>: {status}</p>
            <h3 className="mt-4">Your points so far: <span className="badge bg-secondary">{points}</span></h3>
        </div>
    );
};

export default CoinGame;