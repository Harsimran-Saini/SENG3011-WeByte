import React, { useState } from 'react'
import ReactCardFlip from "react-card-flip";
import "./Card.css";
import Arrow from "../../images/blue-arrow.png"
import { Line } from "react-chartjs-2";

//Line graph data
const data = {
    labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
    datasets: [
      {
        label: "COVID-19 Vaccines Administered",
        data: [0, 0, 0, 0, 0, 0, 0, 4368689, 59441205, 148862997, 341184234, 500608509],
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
