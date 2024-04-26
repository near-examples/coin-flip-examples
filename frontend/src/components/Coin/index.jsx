import Image from "next/image";
import Tail from "./tails.png";
import Head from "./heads.png";
import { useEffect, useState } from "react";

const Coin = ({ loading, result }) => {
	const [animation, setAnimation] = useState({});

	useEffect(() => {
		if (loading) {
			setAnimation({ animation: "flip 2s linear 0s infinite" });
		} else if (!loading && result) {
			setAnimation({ animation: `flip-${result} 1s linear 0s 1 forwards` });
		} else {
			setAnimation({});
		}
	}, [loading, result]);

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
