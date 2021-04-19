import React, { Component } from 'react'
import ReactCardFlip from "react-card-flip";
import "./Card.css";
import Arrow from "../../images/blue-arrow.png"
import { Line } from "react-chartjs-2";

//Line graph data
const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Global COVID-19 Cases",
        data: [2008, 1751, 57655, 71493, 117551, 163973, 293244, 264107, 311514, 598195, 504932, 700941],
        fill: false,
        borderColor: "#42bdff"
      }
    ]
};

class CasesCard extends Component {
  constructor(props) {
    super(props);
    this.state = {isFlipped: false, cases: "140,524,987"};
    this.handleClick = this.handleClick.bind(this);
    this.numberWithCommas = this.numberWithCommas.bind(this)
  }

  componentDidMount() {
    const url = "https://api.covid19api.com/summary"
    fetch(url).then(res => res.json()).then(data => {
        this.setState({
          cases: this.numberWithCommas(data["Global"]["TotalConfirmed"]),
        });
    });
  }
  
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  handleClick() {
    this.setState(({ isFlipped }) => ({ isFlipped: !isFlipped }));
  }

  render() {
    return (
      <ReactCardFlip isFlipped={this.state.isFlipped} flipDirection="horizontal">
        <div className="front1" >
          <p>Global COVID-19 Cases</p>
          <hr/>
          <span>{this.state.cases}</span>
          <button><img src={Arrow} alt="" onClick={this.handleClick}/></button>         
        </div>
        <div className="back1">
          <div>
            <Line data={data} />
          </div>
          <button><img src={Arrow} alt="" onClick={this.handleClick}/></button>
        </div>
      </ReactCardFlip>
    );
  }
}

export default CasesCard

