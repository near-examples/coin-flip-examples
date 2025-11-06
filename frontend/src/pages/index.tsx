import styles from "@/styles/app.module.css";
import { useEffect, useState } from "react";
import Coin from "@/components/Coin";
import { CoinFlipContract } from "@/config";
import { useNear } from "@/hooks/useNear";

type Side = "heads" | "tails" | "loading" | null;

export default function Home() {
  const { signedAccountId, callFunction, viewFunction } = useNear();

  const [side, setSide] = useState<Side>(null);
  const [status, setStatus] = useState<string>("Waiting for user input");
  const [points, setPoints] = useState<number>(0);
  const [choice, setChoice] = useState<"heads" | "tails" | undefined>();
  const [isFlipping, setIsFlipping] = useState(false);

  // Fetch points once when account is connected
  useEffect(() => {
    if (!signedAccountId) return;

    (async () => {
      const score = await viewFunction({
        contractId: CoinFlipContract,
        method: "points_of",
        args: { player: signedAccountId },
      });
      setPoints(Number(score) || 0);
    })();
  }, [signedAccountId, viewFunction]);

  // Handle user's guess
  const handleChoice = async (guess: "heads" | "tails") => {
    if (isFlipping) return; // prevent spam clicks
    setIsFlipping(true);
    setStatus("Flipping the coin...");
    setChoice(guess);
    setSide("loading");

    try {
      const outcome = await callFunction({
        contractId: CoinFlipContract,
        method: "flip_coin",
        args: { player_guess: guess },
      });

      const result = (outcome as any)?.status?.SuccessValue;
      const decodedResult = result 
        ? JSON.parse(Buffer.from(result, 'base64').toString())
        : null;
      
      const outcomeTyped = decodedResult as "heads" | "tails";

      console.log("Coin flip outcome:", outcomeTyped);
      
      setSide(outcomeTyped);

      if (guess === outcomeTyped) {
        setStatus("You were right! You won a point!");
        setPoints((prev) => prev + 1);
      } else {
        setStatus("You were wrong, you lost a point.");
        setPoints((prev) => (prev > 0 ? prev - 1 : 0));
      }
    } catch (err) {
      console.error(err);
      setStatus("An error occurred during the flip.");
    } finally {
      setIsFlipping(false);
    }
  };

  const color = choice === side ? "btn-success" : "btn-danger";

  return (
    <main className={styles.main}>
      <div className="container text-center">
        {!signedAccountId && (
          <h2>
            <strong>Welcome! Login to Play</strong>
          </h2>
        )}

        <div className="my-4">
          <Coin side={side || "heads"} />
        </div>

        {signedAccountId && (
          <div className="mt-5">
            <h2 className="mb-4">What do you think is coming next?</h2>

            <div className="d-flex justify-content-center gap-3">
              <button
                className={`btn ${
                  choice === "heads" && side !== "loading" ? color : "btn-primary"
                }`}
                onClick={() => handleChoice("heads")}
                disabled={isFlipping}
              >
                Heads
              </button>
              <button
                className={`btn ${
                  choice === "tails" && side !== "loading" ? color : "btn-primary"
                }`}
                onClick={() => handleChoice("tails")}
                disabled={isFlipping}
              >
                Tails
              </button>
            </div>

            <p className="mt-3">
              <strong>Status:</strong> {status}
            </p>

            <h3 className="mt-4">
              Your points so far:{" "}
              <span className="ms-2 badge bg-secondary">{points}</span>
            </h3>
          </div>
        )}
      </div>
    </main>
  );
}
