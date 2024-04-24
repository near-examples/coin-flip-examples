import Image from "next/image";
import Tail from './tails.png';
import Head from './heads.png';
import { useState } from "react";

const Coin = () => {
    const [status, setStatus] = useState("");
    const [nader, setNader] = useState("nader");

    const handleCoinClick = () => {
        setNader("");
        if (Math.random() < 0.5) {
            setStatus("heads");
            console.log("heads");
        } else {
            setStatus("tails");
            console.log("tails");
        }
    };

    return (
        <div className="coin-container fadeIn">
            <div id="coin" className={status} key={+new Date()}>
                <div class="side-a slideIn">
                    <Image src={Head} alt="Coin's head"  />
                </div>
                <div className="side-b">
                    <Image src={Tail} alt="Coin's tail" />
                </div>
            </div>
            <button onClick={handleCoinClick}>Flip Coin</button>
        </div>

    )
}

export default Coin