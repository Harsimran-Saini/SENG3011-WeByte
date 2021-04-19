// import React, { useState, useEffect } from 'react'
// import ReactCardFlip from "react-card-flip";
// import "./Card.css";
// import { Scatter } from "react-chartjs-2";
// import { Spinner } from "react-bootstrap"
// import Select from 'react-select'
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import Tabletop from 'tabletop';

// var countries = ['Australia','China', 'Japan', 'Ghana', 'New Zealand', 'Russia'];

// // filter by date, change api, filter by location
// const countryFilter = [
//   { value: 'australia', label: 'Australia' },
//   { value: 'china', label: 'China' },
//   { value: 'usa', label: 'USA' },
//   { value: 'ghana', label: 'Ghana' },
//   { value: 'newzealand', label: 'New Zealand' },
//   { value: 'russia', label: 'Russia' },
//   { value: 'world', label: 'World' }
// ]

// const apiFilter = [
//   { value: 'promed', label: 'PROMED-Mail (default)' },
//   { value: 'who', label: 'World Health Organisation (WHO)' },
//   { value: 'googlesheets', label: 'Google Sheets (Upload Your Own Data)' },
//   { value: 'covid', label: 'COVID-19 API' }
// ]

// // Scatter Plot Values
// const values = [{
//   x: 123,
//   y: 232
// }, {
//   x: 134,
//   y: 242
// }, {
//   x: 156,
//   y: 268
// }, {
//   x: 178,
//   y: 289
// }, {
//   x: 191,
//   y: 301
// }, {
//   x: 218,
//   y: 322
// }];

// //Generate list of unique colours for each data point
// var dynamicColors = function() {
//   var r = Math.floor(Math.random() * 255);
//   var g = Math.floor(Math.random() * 255);
//   var b = Math.floor(Math.random() * 255);
//   return "rgb(" + r + "," + g + "," + b + ")";
// };

// const backgroundColours = []
// for (var i in values) {
//   var colour=dynamicColors();
//   backgroundColours.push(colour);
// }

// //Graph titles
// const xAxes_title = "News Reports";
// const yAxes_title = "Cumulative Covid-19 Cases";

// //Graph options info
// const options = {
//   responsive: true,
//   title: {
//     display: true,
//     text: xAxes_title + ' v ' + yAxes_title
//   },
//   tooltips: {
//     callbacks: {
//        label: function(tooltipItem, data) {
//           var label = data.labels[tooltipItem.index];
//           return label + ': (' + tooltipItem.xLabel + ', ' + tooltipItem.yLabel + ')';
//        }
//     }
//   },
//   scales: {
//     yAxes: [
//       {
//         scaleLabel: {
//           display: true,
//           labelString: xAxes_title
//         }
//       }
//     ], 
//     xAxes: [
//       {
//         type: 'logarithmic',
//         scaleLabel: {
//           display: true,
//           labelString: yAxes_title
//         },
//         ticks: {
//          max: 10000000,
//          callback: function (value, index, values) {
//              if (value === 10000000) return "10M";
//              if (value === 1000000) return "1M";
//              if (value === 100000) return "100K";
//              if (value === 10000) return "10K";
//              if (value === 1000) return "1K";
//              if (value === 100) return "100";
//              if (value === 10) return "10";
//              if (value === 1) return "1";
//              return null;
//             }
//         }
//       }
//     ]
//   }
// }

// // Graph data info
// // const baseGraphData = {
// //   labels: ['Australia','China', 'USA', 'Ghana', 'New Zealand', 'Russia'],
// //   datasets: [{
// //     label: "Countries",
// //     data: values,
// //     pointRadius: 8,
// //     pointHoverRadius: 11,
// //     backgroundColor: backgroundColours
// //   }],
// // };

// function createGraphData(plotPoints, labels) {
//     const backgroundColours = []
//     // for (var i in labels) {
//     //   var colour = dynamicColors();
//     //   backgroundColours.push(colour);
//     // }

//     return {
//       labels: labels,
//       datasets: [{
//         label: "Countries",
//         data: plotPoints,
//         pointRadius: 8,
//         pointHoverRadius: 11,
//         backgroundColor: backgroundColours
//       }],
//     };
// }

// function createInitialGraphData(setGraphData, setIsLoading) {
//     countries = countries.map(e => e.replace(/\s+/g, '-').toLowerCase());
//     var plot_points = {};

//     const url = "https://nsg2nkvz9l.execute-api.ap-southeast-2.amazonaws.com/we-byte/covid-report-count-by-country";

//     fetch(url)
//     .then(res => {
//         if (res.ok) {
//             return res.json();
//         } else {
//             throw new Error("Invalid Response Code: "+res.status);
//         }
//     })
//     .then(data => {
//         var promise_list = [];

//         countries.forEach(country => {
//             const countryKey = country.replace(/-/g, ' ').toUpperCase();
//             var reportsForCountry = 0;
//             if (countryKey in data) {
//                 reportsForCountry = data[countryKey];
//             }

//             var newObject = {
//                 "x" : null,
//                 "y" : reportsForCountry
//             };

//             plot_points[country] = (newObject)

//             const url = "https://api.covid19api.com/total/country/"+country+"/status/confirmed?from=2020-01-01T00:00:00Z&to=2021-01-01T00:00:00Z"

//             promise_list.push(
//                 fetch(url, {
//                     headers: {
//                         "X-Access-Token" : "d503a308-19c9-45f5-a9cd-b34fb3a47adb"
//                     }
//                 })
//                 .then(res => res.json())
//                 .then(data => {
//                     plot_points[country]["x"] = data[data.length-1]["Cases"];
//                 })
//             );
//         });

//         Promise.all(promise_list)
//         .then(data => {
//             var labels = []
//             var dataPoints = []

//             for (var key in plot_points) {
//                 labels.push(key);
//                 dataPoints.push(plot_points[key]);
//             }

//             const newGraphData = createGraphData(dataPoints, labels);
//             setGraphData(newGraphData);
//             setIsLoading(false);
//         });
//     })
//     .catch(err => {
//         console.log(err);
//     })

//     Tabletop.init({
//       key: '1BCNRtoJorviGwx1aZia5o8ObbshvLVuIc7Xjgn5xrvc',
//       callback: googleData => {
//         console.log("google", googleData)
//       },
//       simpleSheet: false
//     });
//     console.log("finish")
// }

// const Card = () => {
//     // flipped state
//     const [isFlipped, setIsFlipped] = useState(false);
    
//     const [startDate, setStartDate] = useState(new Date());

//     const [graphData, setGraphData] = useState(null);

//     const [isLoading, setIsLoading] = useState(true);

//     //if button is clicked
//     const handleClick = () => {
//         setIsFlipped(!isFlipped);
//     };

//     //if sidebar is opened or closed
//     const [showSidebar, setShowSidebar] = useState(false)
//     const onClickSidebar = () => {
//       setShowSidebar(!showSidebar);
//     };

//     useEffect(() => {
//         async function fetchData() {
//             createInitialGraphData(setGraphData, setIsLoading);
//         }

//         fetchData();
//     }, []);

//     return (
//       <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">

//         {/* FRONT OF CARD-- GRAPH */}
//         <div className="regression-front" >
//           { showSidebar ? <div className="nav">
        
//         <button onClick={onClickSidebar}><i className="fa fa-times"></i></button>
//         <p>Filters</p>
        
//         <DatePicker className="date" selected={startDate} onChange={date => setStartDate(date)} />
//         <Select className="cFilter" options={countryFilter} />
//         <Select className="aFilter" options={apiFilter} />
        
//       </div> : null }
//           <p><i className="fa fa-signal fa-fw"></i>Charts</p>
//           <div className="filtersButton">
//             <button onClick={onClickSidebar}><i className="fa fa-bars"></i></button>
//           </div>
//           <hr/>
//           <div className="chart" id="graph123">
//               {isLoading ?
//                 <Spinner animation="border" /> :
//                 <Scatter data={graphData} options={options} />
//               }

//           </div>
//           <button onClick={handleClick}>Click to view Analysis</button>
          
//         </div>


//         {/* BACK OF CARD-- ANALYSIS TEXT */}
//         <div className="regression-back">
//           <p><i class="fa fa-signal fa-fw"></i>Regression Analysis</p>
//           <text id="regression-back">
//           <hr/>
//           <div>
//             <br/>
//             <p>Some bs text from Wikipedia- DELETE!! Coronaviruses are a group of related RNA viruses that cause diseases in mammals and birds. In humans and birds, they cause respiratory tract infections that can range from mild to lethal. Mild illnesses in humans include some cases of the common cold (which is also caused by other viruses, predominantly rhinoviruses), while more lethal varieties can cause SARS, MERS, and COVID-19. In cows and pigs they cause diarrhea, while in mice they cause hepatitis and encephalomyelitis.</p>
//             <p>Coronaviruses constitute the subfamily Orthocoronavirinae, in the family Coronaviridae, order Nidovirales, and realm Riboviria.[5][4] They are enveloped viruses with a positive-sense single-stranded RNA genome and a nucleocapsid of helical symmetry.[6] The genome size of coronaviruses ranges from approximately 26 to 32 kilobases, one of the largest among RNA viruses.[7] They have characteristic club-shaped spikes that project from their surface, which in electron micrographs create an image reminiscent of the solar corona, from which their name derives.[8]</p>
//             <p>Coronaviruses constitute the subfamily Orthocoronavirinae, in the family Coronaviridae, order Nidovirales, and realm Riboviria.</p>
//           </div>
//           </text>
//           <button onClick={handleClick}>Click to view Graph</button>
//         </div>
//       </ReactCardFlip>
//     )
// }

// export default Card


import React, { Component } from 'react';
import Tabletop from 'tabletop';
import ReactCardFlip from "react-card-flip";
import { Scatter, Line, Pie, Bar } from "react-chartjs-2";
import casesJSON from './cases.json';

function matchUp(country) {
  console.log("cJ", country)
  for (var i = 0; i < casesJSON["Countries"].length; i++) {
    if (country === casesJSON["Countries"][i]["Country"]) {
      console.log("aaa");
      return casesJSON["Countries"][i];
    }
  }
  return {};
}

class RegressionCard extends Component {
  constructor() {
    super()
    this.state = {
      data: [],
      isFlipped: false,
      showSidebar: false,
      options: {},
      keys: [],
      graphType: ''
    }

    this.handleClick = this.handleClick.bind(this);
    this.onClickSidebar = this.onClickSidebar.bind(this);

  }


  componentDidMount() {
    Tabletop.init({
      key: '1BCNRtoJorviGwx1aZia5o8ObbshvLVuIc7Xjgn5xrvc',
      callback: googleData => {

        //Graph Type
        var graphType = googleData["Graph Selection"].elements[0]["Graph Type"];
        console.log(googleData[graphType])
        
        //Graph Keys
        var keys = Object.values(googleData[graphType].elements[0]);
        keys.shift();
        console.log("keys", keys)


        //Graph Values
        var data = googleData[graphType].elements;
        data.shift();
        console.log("data", data)
        this.setState({
          data: data,
          keys: keys,
          graphType: graphType
        })
      },
      simpleSheet: false
    });

  }


  handleClick() {
    this.setState(({ isFlipped }) => ({ isFlipped: !isFlipped }));
  }

  onClickSidebar() {
    this.setState(({ showSidebar }) => ({ showSidebar: !showSidebar }));
  }
  

  render() {

    let graph;
    if (this.state.graphType === "Scatter") {
      console.log("graphy type", this.state.graphType)
      const values = [];
      const labels = [];
      const backgroundColours = [];
      var xAxes_title = "News Reports";
      var yAxes_title = "Cumulative Covid-19 Cases";
    
      if (this.state.keys.length === 3) {
        // eslint-disable-next-line array-callback-return
        this.state.data.map(obj => {
          var x = obj["X-Axis"].replace(/,/g, "");
          var y = obj["Y-Axis"].replace(/,/g, "");
          var json = { x: parseInt(x), y: parseInt(y)};
          values.push(json);
          labels.push(obj["Plot Label"])
        });
        console.log("3");
        xAxes_title = this.state.keys[1];
        yAxes_title = this.state.keys[2];
  
      } else if (this.state.keys.length === 2) {
        console.log("2")
        this.state.data.map(obj => {
          var country = obj[this.state.keys[0]];
          var jsonAPI = matchUp(country);
          console.log("json", jsonAPI);
          if (Object.keys(jsonAPI).length > 0) {
            var x = jsonAPI["TotalConfirmed"].replace(/,/g, "");
            var y = obj["Y-Axis"].replace(/,/g, "");
          
            values.push({x: parseInt(x), y: parseInt(y)});
            labels.push(obj["Plot Label"])
          }
        });
  
        xAxes_title = "Cumulative Covid-19 Cases";
        yAxes_title = this.state.keys[1];
  
      } else {
        console.log("1");
  
      }
      
      for (var k in values) {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        var colour= "rgb(" + r + "," + g + "," + b + ")";
        backgroundColours.push(colour);
      }
    
        
      
      // Graph data info
      const scatterData = {
        labels: labels,
        datasets: [{
          label: "Countries",
          data: values,
          pointRadius: 8,
          pointHoverRadius: 11,
          backgroundColor: backgroundColours
        }],
      };
  
      
      console.log("sc", scatterData)
      console.log("ac", values.length)
      console.log("scc", labels.length)
      console.log("scc", backgroundColours.length)
  
      //Graph options info
      const options = {
        responsive: true,
        title: {
          display: true,
          text: xAxes_title + ' v ' + yAxes_title
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
                var label = data.labels[tooltipItem.index];
                return label + ': (' + tooltipItem.xLabel + ', ' + tooltipItem.yLabel + ')';
            }
          }
        },
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: yAxes_title
              }
            }
          ], 
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: xAxes_title
              }
            }
          ]
        }
      }
      
      graph = <Scatter data={scatterData} options={options} />
    } else if (this.state.graphType === "Bar") {
      const values = [];
      const labels = [];
      const backgroundColours = [];
      const hoverBackgroundColor = [];
      const xAxes = this.state.keys[0];
      const yAxes = this.state.keys[1];
      const title = this.state.keys[2];
      //data and labels
      this.state.data.map(obj => {
        var val = obj["Y-Axis"].replace(/,/g, "");
        values.push(parseInt(val));
        labels.push(obj["X-Axis"])
      });

      //graph colours
      for (var k in values) {
        var r3 = Math.floor(Math.random() * 255);
        var g3 = Math.floor(Math.random() * 255);
        var b3 = Math.floor(Math.random() * 255);
        var colour3= "rgb(" + r3 + "," + g3 + "," + b3 + ")";
        backgroundColours.push(colour3);
        hoverBackgroundColor.push("rgb(" + r3 + "," + g3 + "," + b3 + ", 0.7)");
      }

      const state = {
        labels: labels,
        datasets: [
          {
            label: yAxes,
            backgroundColor: backgroundColours,
            borderColor: 'rgba(0,0,0,0.5)',
            hoverBackgroundColor: hoverBackgroundColor,
            borderWidth: 1,
            data: values
          }
        ]
      }

      const options = {
        title:{
          display:true,
          text:title,
          fontSize:20
        },
        legend:{
          display:true,
          position:'right'
        },
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: yAxes
              }
            }
          ], 
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: xAxes
              }
            }
          ]
        }
      }
      graph = <Bar data={state} options={options}/>
    } else if (this.state.graphType === "Line") {
      const values = [];
      const labels = [];
      const xAxes = this.state.keys[0];
      const yAxes = this.state.keys[1];
      const title = this.state.keys[2];

      //data and labels
      this.state.data.map(obj => {
        var val = obj["Y-Axis"].replace(/,/g, "");
        values.push(parseInt(val));
        labels.push(obj["X-Axis"])
      });

      const state = {
        labels: labels,
        datasets: [
          {
            label: yAxes,
            fill: false,
            lineTension: 0.,
            backgroundColor: 'rgba(75,192,200,1)',
            borderColor: 'rgba(75,192,200,0.3)',
            hoverBackgroundColor: 'rgba(173, 178, 179, 1)',
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 10,
            data: values
          }
        ]
      }

      const options = {
        title:{
          display:true,
          text: title,
          fontSize:20
        },
        legend:{
          display:true,
          position:'right'
        },
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: yAxes
              }
            }
          ], 
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: xAxes
              }
            }
          ]
        }
      }
      graph = <Line
          data={state}
          options={options}
        />

    } else if (this.state.graphType === "Pie") {
      console.log("a", this.state.keys)
      console.log("b", this.state.data)

      const values = [];
      const labels = [];
      const backgroundColours = [];
      const hoverBackgroundColor = [];
      const xAxes = this.state.keys[0];
      const yAxes = this.state.keys[1];

      //data and labels
      this.state.data.map(obj => {
        var val = obj["Value"].replace(/,/g, "");
        values.push(parseInt(val));
        labels.push(obj["Segment Label"])
      });

      //graph colours
      for (var k in values) {
        var r3 = Math.floor(Math.random() * 255);
        var g3 = Math.floor(Math.random() * 255);
        var b3 = Math.floor(Math.random() * 255);
        var colour3= "rgb(" + r3 + "," + g3 + "," + b3 + ")";
        backgroundColours.push(colour3);
        hoverBackgroundColor.push("rgb(" + r3 + "," + g3 + "," + b3 + ", 0.7)");
      }

      // graph dataset
      const state = {
        labels: labels,
        datasets: [
          {
            label: xAxes,
            backgroundColor: backgroundColours,
            hoverBackgroundColor: hoverBackgroundColor,
            data: values
          }
        ]
      }

      //graph options
      const options = {
        title:{
          display:true,
          text: xAxes + ' v ' + yAxes,
          fontSize:15
        },
        legend:{
          display:true,
          position:'right'
        }
      }

      graph=<Pie data={state} options={options} />
    }
    
    

    return (
      <ReactCardFlip isFlipped={this.state.isFlipped} flipDirection="horizontal">

        {/* FRONT OF CARD-- GRAPH */}
        <div className="regression-front" >
          <p><i class="fa fa-signal fa-fw"></i>Charts</p>
          <div className="filtersButton">
            <button onClick={this.onClickSidebar}><i class="fa fa-bars"></i></button>
          </div>
          <hr/>
          <div className="chart">
            {graph}
          </div>
          <button onClick={this.handleClick}>Click to view Analysis</button>
          
        </div>


        {/* BACK OF CARD-- ANALYSIS TEXT */}
        <div className="regression-back">
          <p><i class="fa fa-signal fa-fw"></i>Regression Analysis</p>
          <hr/>
          <text id="regression-back">
          <div>
            <br/>
            <p>Some bs text from Wikipedia- DELETE!! Coronaviruses are a group of related RNA viruses that cause diseases in mammals and birds. In humans and birds, they cause respiratory tract infections that can range from mild to lethal. Mild illnesses in humans include some cases of the common cold (which is also caused by other viruses, predominantly rhinoviruses), while more lethal varieties can cause SARS, MERS, and COVID-19. In cows and pigs they cause diarrhea, while in mice they cause hepatitis and encephalomyelitis.</p>
            <p>Coronaviruses constitute the subfamily Orthocoronavirinae, in the family Coronaviridae, order Nidovirales, and realm Riboviria.[5][4] They are enveloped viruses with a positive-sense single-stranded RNA genome and a nucleocapsid of helical symmetry.[6] The genome size of coronaviruses ranges from approximately 26 to 32 kilobases, one of the largest among RNA viruses.[7] They have characteristic club-shaped spikes that project from their surface, which in electron micrographs create an image reminiscent of the solar corona, from which their name derives.[8]</p>
            <p>Coronaviruses constitute the subfamily Orthocoronavirinae, in the family Coronaviridae, order Nidovirales, and realm Riboviria.</p>
          </div>
          </text>
          <button onClick={this.handleClick}>Click to view Graph</button>
        </div>
      </ReactCardFlip>
    )
  }
}

export default RegressionCard;