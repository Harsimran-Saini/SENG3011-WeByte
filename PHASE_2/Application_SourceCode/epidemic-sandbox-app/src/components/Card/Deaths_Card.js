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
        label: "Global Death Toll",
        data: [265, 2980, 45276, 240895, 393543, 534933, 706086, 883095, 1037959, 1215349, 1491565, 1836618],
        fill: false,
        borderColor: "#faa937"
      }
    ]
};

class DeathsCard extends Component {
  constructor(props) {
    super(props);
    this.state = {isFlipped: false, deaths: "3,008,465"};
    this.handleClick = this.handleClick.bind(this);
    this.numberWithCommas = this.numberWithCommas.bind(this)
  }

  componentDidMount() {
    const url = "https://api.covid19api.com/summary"
    fetch(url).then(res => res.json()).then(data => {
        this.setState({
          deaths: this.numberWithCommas(data["Global"]["TotalDeaths"]),
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
          <p>Global COVID-19 Deaths</p>
          <hr/>
          <span>{this.state.deaths}</span>
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

export default DeathsCard
