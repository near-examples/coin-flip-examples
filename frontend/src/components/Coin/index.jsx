import Image from "next/image";
import Tail from "./tails.png";
import Head from "./heads.png";
import { useEffect, useState } from "react";

const Coin = ({ side }) => {
	const [animation, setAnimation] = useState({});

	useEffect(() => {
		switch (side) {
			case "heads":
				setAnimation({ animation: "flip-heads 1s linear 0s 1 forwards" });
				break;
			case "tails":
				setAnimation({ animation: "flip-tails 1s linear 0s 1 forwards" });
				break;
			case "loading":
				setAnimation({ animation: "flip 2s linear 0s infinite" });
				break;
			default:
				setAnimation({});
		}
	}, [side]);

	return (
		<>
			<div id="coin" style={animation}>
				<div className="heads">
					<Image src={Tail} alt="Coin's tail" />
				</div>
				<div className="tails">
					<Image src={Head} alt="Coin's head" />
				</div>
			</div>
		</>
	);
};

export default Coin;
