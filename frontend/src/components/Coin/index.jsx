import Image from "next/image";
import Tail from "./tails.png";
import Head from "./heads.png";
const Coin = ({ side }) => {
	const animations = {
		heads: "flip-heads 1s linear 0s 1 forwards",
		tails: "flip-tails 1s linear 0s 1 forwards",
		loading: "flip 2s linear 0s infinite",
	};
	const animation = animations[side] ? { animation: animations[side] } : {};

	return (
		<>
			<div id="coin" style={animation}>
				<div className="heads">
					<Image src={Tail} alt="Coin's tail" priority />
				</div>
				<div className="tails">
					<Image src={Head} alt="Coin's head" priority />
				</div>
			</div>
		</>
	);
};

export default Coin;
