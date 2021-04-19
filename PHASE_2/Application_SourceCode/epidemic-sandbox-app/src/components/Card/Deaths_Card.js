import React, { useState } from 'react'
import ReactCardFlip from "react-card-flip";
import "./Card.css";
import Arrow from "../../images/blue-arrow.png"
import { Line } from "react-chartjs-2";

//Line graph data
const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Global Death Toll",
        data: [265, 2980, 45276, 240895, 393543, 534933, 706086, 883095, 1037959, 1215349, 1491565, 1836618],
        fill: false,
        borderColor: "#742774"
      }
    ]
};

const Card = () => {
    // flipped state
    const [isFlipped, setIsFlipped] = useState(false);

    //if button is clicked
    const handleClick = () => {
        setIsFlipped(!isFlipped);
    };

    
    return (
        <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
            <div className="front1" >
                <p>Global COVID-19 Deaths</p>
                <hr/>
                <span>2,914,285</span>
                <button><img src={Arrow} alt="" onClick={handleClick}/></button>
            </div>

            <div className="back1">
              <div>
                <Line data={data} />
              </div>
              <button><img src={Arrow} alt="" onClick={handleClick}/></button>
            </div>
        </ReactCardFlip>
    )
}

export default Card
