// import React, { useState, useEffect } from 'react'
// import ReactCardFlip from "react-card-flip";
// import "./Card.css";
// import { Scatter } from "react-chartjs-2";
// import Select from 'react-select'
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import Tabletop from "tabletop";
// import CountriesJson from "./latlng.json"
// import useGoogleSheets from 'use-google-sheets';

// // filter by date, change api, filter by location
// const countryFilter = []

// const apiFilter = [
//   { value: 'promed', label: 'PROMED-Mail (default)' },
//   { value: 'who', label: 'World Health Organisation (WHO)' },
//   { value: 'googlesheets', label: 'Google Sheets (Upload Your Own Data)' },
//   { value: 'covid', label: 'COVID-19 API' }
// ]

// const graphFilter = [
//   { value: 'scatter', label: 'Scatter Plot' },
//   { value: 'bar', label: 'Bar Graph' },
//   { value: 'line', label: 'Line Graph' },
//   { value: 'pie', label: 'Pie Chart' }
// ]

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
//         scaleLabel: {
//           display: true,
//           labelString: yAxes_title
//         }
//       }
//     ]
//   }
// }

// const json = [{Country: "Australia", x: 123},{Country: "Burundi", x: 1023},{Country: "Cuba", x: 723}]

// function matchUp(country) {
//   for (var i = 0; i < json.length; i++) {
//     if (country === json[i]["Country"]) {
//       return json[i];
//     }
//   }
//   return {};
// }
// const Card = () => {

//     const { data2, loading, error } = useGoogleSheets({
//       apiKey: 'AIzaSyDEYq35gpEqFPG56D5YlUqBUlGyV8I5MBI',
//       sheetId: '1BCNRtoJorviGwx1aZia5o8ObbshvLVuIc7Xjgn5xrvc',
//     });

//     console.log("test3", JSON.stringify(data2));

//     // flipped state
//     const [isFlipped, setIsFlipped] = useState(false);
    
//     const [startDate, setStartDate] = useState(new Date());

//     //if button is clicked
//     const handleClick = () => {
//         setIsFlipped(!isFlipped);
//     };

//     //if sidebar is opened or closed
//     const [showSidebar, setShowSidebar] = useState(false)
//     const onClickSidebar = () => {
//       setShowSidebar(!showSidebar);
//     };

//     //Google Sheets Data Extraction
//     const [googledata, setGoogledata] = useState([]);

//     useEffect(() => {
//       Tabletop.init({
//         key: "1BCNRtoJorviGwx1aZia5o8ObbshvLVuIc7Xjgn5xrvc",
//         simpleSheet: true
//       })
//         .then((googledata) => setGoogledata(googledata))
//         .catch((err) => console.warn(err));
//     }, []);

//     // const values = [{x: 141, y: 19}, {x: 123, y: 92}, {x: 29, y: 82}];
//     // const labels = ["Australia", "China", "USA"];

//     const values = [];
//     const labels = [];

//     // var keys = Object.keys(googledata[0]);
    
//     // //if only 1 variable given 
//     // if (keys.length === 2) {
//     //   for (var i = 0; i < googledata.length; i++) {
//     //     var country = googledata[i][keys[0]];
//     //     var jsonAPI = matchUp(country);
//     //     if (Object.keys(jsonAPI).length === 0) {
//     //       continue;
//     //     }
//     //     var keys2 = Object.keys(jsonAPI);
//     //     values.push({x: jsonAPI[keys2[1]], y: googledata[i][keys[1]]});
//     //     labels.push(googledata[i][keys[0]]);
//     //   }

//     // } else if (keys.length === 3) {
//     //   for (i = 0; i < googledata.length; i++) {
//     //     values.push({x: googledata[i][keys[1]], y: googledata[i][keys[2]]});
//     //     labels.push(googledata[i][keys[0]]);
//     //   }
//     // } else {
//     //   alert("Google Sheets not filled out correctly");
//     // }

//     //Generate list of unique colours for each data point
//     var dynamicColors = function() {
//       var r = Math.floor(Math.random() * 255);
//       var g = Math.floor(Math.random() * 255);
//       var b = Math.floor(Math.random() * 255);
//       return "rgb(" + r + "," + g + "," + b + ")";
//     };

//     const backgroundColours = []
//     // eslint-disable-next-line
//     for (var k in values) {
//       var colour=dynamicColors();
//       backgroundColours.push(colour);
//     }

//     // Graph data info
//     const data = {
//       labels: labels,
//       datasets: [{
//         label: "Countries",
//         data: values,
//         pointRadius: 8,
//         pointHoverRadius: 11,
//         backgroundColor: backgroundColours
//       }],
//     };

//     for (var i in CountriesJson) {
//       var json = { value: CountriesJson[i]["name"].toLowerCase(), label: CountriesJson[i]["name"]}
//       countryFilter.push(json);
//     }
//     const [selectedOption, setSelectedOption] = useState(null);

    
//     return (
//       <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">

//         {/* FRONT OF CARD-- GRAPH */}
//         <div className="regression-front" >
//           { showSidebar ? <div className="nav">
        
//         <button onClick={onClickSidebar}><i class="fa fa-times"></i></button>
//         <p>Filters</p>

        
//         {/* <DatePicker style = {{position: 'absolute', marginTop: 20}} className="date" selected={startDate} onChange={date => setStartDate(date)} /> */}
//         {/* <Select className="cFilter" options={countryFilter} /> */}
//         {/* <Select className="aFilter" options={apiFilter} /> */}
//         <label style ={{position: 'absolute', top: 100}}>
//           Filter by Country<br/>
//           <select style={{width: 200}}value={selectedOption} onChange={() => setSelectedOption(selectedOption)}>
//           <option value=""></option>
//           {
//             countryFilter.map(item => {
//                 return (
//                   <option value={item.value}>{item.label}</option>
//                 );
//             })
//           }
            
//           </select>
//         </label>
//         <label style ={{position: 'absolute', top: 150}}>
//           Filter by API
//           <select value={selectedOption} onChange={() => setSelectedOption(selectedOption)}>
//           <option value=""></option>
//             {
//               apiFilter.map(item => {
//                   return (
//                     <option value={item.value}>{item.label}</option>
//                   );
//               })
//             }
//           </select>
//         </label>
//         <label style ={{position: 'absolute', top: 250}}>
//           Change Graph Type
//           <select value={selectedOption} onChange={() => setSelectedOption(selectedOption)}>
//           <option value=""></option>
//             {
//               graphFilter.map(item => {
//                   return (
//                     <option value={item.value}>{item.label}</option>
//                   );
//               })
//             }
//           </select>
//         </label>
//       </div> : null }

//           <p><i class="fa fa-signal fa-fw"></i>Charts</p>
//           <div className="filtersButton">
//             <button onClick={onClickSidebar}><i class="fa fa-bars"></i></button>
//           </div>
//           <hr/>
//           <div className="chart">
//             <Scatter data={data} options={options} />
//           </div>
//           <button onClick={handleClick}>Click to view Analysis</button>
          
//         </div>


//         {/* BACK OF CARD-- ANALYSIS TEXT */}
//         <div className="regression-back">
//           <p><i class="fa fa-signal fa-fw"></i>Regression Analysis</p>
//           <hr/>
//           <div>
//             <br/>
//             <p>Some bs text from Wikipedia- DELETE!! Coronaviruses are a group of related RNA viruses that cause diseases in mammals and birds. In humans and birds, they cause respiratory tract infections that can range from mild to lethal. Mild illnesses in humans include some cases of the common cold (which is also caused by other viruses, predominantly rhinoviruses), while more lethal varieties can cause SARS, MERS, and COVID-19. In cows and pigs they cause diarrhea, while in mice they cause hepatitis and encephalomyelitis.</p>
//             <p>Coronaviruses constitute the subfamily Orthocoronavirinae, in the family Coronaviridae, order Nidovirales, and realm Riboviria.[5][4] They are enveloped viruses with a positive-sense single-stranded RNA genome and a nucleocapsid of helical symmetry.[6] The genome size of coronaviruses ranges from approximately 26 to 32 kilobases, one of the largest among RNA viruses.[7] They have characteristic club-shaped spikes that project from their surface, which in electron micrographs create an image reminiscent of the solar corona, from which their name derives.[8]</p>
//             <p>Coronaviruses constitute the subfamily Orthocoronavirinae, in the family Coronaviridae, order Nidovirales, and realm Riboviria.</p>
//           </div>
//           <button onClick={handleClick}>Click to view Graph</button>
//         </div>
//       </ReactCardFlip>
//     )
// }

// export default Card

import React, { Component } from 'react';
import Tabletop from 'tabletop';
import ReactCardFlip from "react-card-flip";
import { Scatter } from "react-chartjs-2";
import casesJSON from './cases.json'
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

class App extends Component {
  constructor() {
    super()
    this.state = {
      data: [],
      isFlipped: false,
      showSidebar: false,
      scatterData: {},
      options: {},
      keys: [],
    }

    this.handleClick = this.handleClick.bind(this);
    this.onClickSidebar = this.onClickSidebar.bind(this);

  }


  componentDidMount() {
    Tabletop.init({
      key: '1BCNRtoJorviGwx1aZia5o8ObbshvLVuIc7Xjgn5xrvc',
      callback: googleData => {
        this.setState({
          data: googleData,
          keys: Object.keys(googleData[0])
        })
      },
      simpleSheet: true
    });

  }


  handleClick() {
    this.setState(({ isFlipped }) => ({ isFlipped: !isFlipped }));
  }

  onClickSidebar() {
    this.setState(({ showSidebar }) => ({ showSidebar: !showSidebar }));
  }
  

  render() {
    const values = [];
    const labels = [];
    const backgroundColours = [];
    var xAxes_title = "News Reports";
    var yAxes_title = "Cumulative Covid-19 Cases";
  
    if (this.state.keys.length === 3) {
      // eslint-disable-next-line array-callback-return
      this.state.data.map(obj => {
        var json = { x: obj[this.state.keys[1]], y: obj[this.state.keys[2]]};
        values.push(json);
        labels.push(obj[this.state.keys[0]])
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
          values.push({x: jsonAPI["TotalConfirmed"], y: obj[this.state.keys[1]]});
          labels.push(obj[this.state.keys[0]]);
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
            <Scatter data={scatterData} options={options} />
          </div>
          <button onClick={this.handleClick}>Click to view Analysis</button>
          
        </div>


        {/* BACK OF CARD-- ANALYSIS TEXT */}
        <div className="regression-back">
          <p><i class="fa fa-signal fa-fw"></i>Regression Analysis</p>
          <hr/>
          <div>
            <br/>
            <p>Some bs text from Wikipedia- DELETE!! Coronaviruses are a group of related RNA viruses that cause diseases in mammals and birds. In humans and birds, they cause respiratory tract infections that can range from mild to lethal. Mild illnesses in humans include some cases of the common cold (which is also caused by other viruses, predominantly rhinoviruses), while more lethal varieties can cause SARS, MERS, and COVID-19. In cows and pigs they cause diarrhea, while in mice they cause hepatitis and encephalomyelitis.</p>
            <p>Coronaviruses constitute the subfamily Orthocoronavirinae, in the family Coronaviridae, order Nidovirales, and realm Riboviria.[5][4] They are enveloped viruses with a positive-sense single-stranded RNA genome and a nucleocapsid of helical symmetry.[6] The genome size of coronaviruses ranges from approximately 26 to 32 kilobases, one of the largest among RNA viruses.[7] They have characteristic club-shaped spikes that project from their surface, which in electron micrographs create an image reminiscent of the solar corona, from which their name derives.[8]</p>
            <p>Coronaviruses constitute the subfamily Orthocoronavirinae, in the family Coronaviridae, order Nidovirales, and realm Riboviria.</p>
          </div>
          <button onClick={this.handleClick}>Click to view Graph</button>
        </div>
      </ReactCardFlip>
    )
  }
}

export default App;