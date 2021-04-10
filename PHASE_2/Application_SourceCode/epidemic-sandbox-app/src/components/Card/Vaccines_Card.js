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
        label: "Global Deaths",
        data: [3323, 53233, 85333, 412323, 44123, 65232, 10332, 13023, 29302, 2839283, 28392833, 2839283],
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)"
      },
      {
        label: "Second dataset",
        data: [33, 25, 35, 51, 54, 76],
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
                <p>Global COVID-19 Vaccines Administered</p>
                <hr/>
                <span>733,604,125</span>
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
