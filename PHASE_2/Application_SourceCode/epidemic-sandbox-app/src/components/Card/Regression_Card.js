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
import Select from 'react-select'
import Tabletop from 'tabletop';
import ReactCardFlip from "react-card-flip";
import { Scatter, Line, Pie, Bar } from "react-chartjs-2";
import casesJSON from './cases.json';
import Arrow from "../../images/blue-arrow.png"

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
      graphType: '',
      dataSelected: "promed_covid_data"
    }

    this.handleClick = this.handleClick.bind(this);
    this.handleDataSelectChange = this.handleDataSelectChange.bind(this);
    this.onClickSidebar = this.onClickSidebar.bind(this);
    this.handleSheetsRefresh = this.handleSheetsRefresh.bind(this);

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

  handleDataSelectChange(event) {
    this.setState({
        dataSelected: event.value
    });
  }

  handleSheetsRefresh() {
    this.componentDidMount();
  }

  handleClick() {
    this.setState(({ isFlipped }) => ({ isFlipped: !isFlipped }));
  }

  onClickSidebar() {
    this.setState(({ showSidebar }) => ({ showSidebar: !showSidebar }));
  }

  render() {
    let graph;
    console.log(this.state.dataSelected);

    if (this.state.dataSelected === "promed_covid_data") {
        var data = {"datasets": [{"label": "Ireland", "data": [{"x": 93532, "y": 44}], "backgroundColor": "rgb(54,113,138)"}, {"label": "Australia", "data": [{"x": 56920, "y": 130}], "backgroundColor": "rgb(130,57,53)"}, {"label": "Argentina", "data": [{"x": 1629594, "y": 239}], "backgroundColor": "rgb(25,134,130)"}, {"label": "Egypt", "data": [{"x": 139471, "y": 129}], "backgroundColor": "rgb(3,136,199)"}, {"label": "Jordan", "data": [{"x": 295765, "y": 101}], "backgroundColor": "rgb(40,176,213)"}, {"label": "Norway", "data": [{"x": 49803, "y": 17}], "backgroundColor": "rgb(80,241,166)"}, {"label": "Peru", "data": [{"x": 1015137, "y": 244}], "backgroundColor": "rgb(119,149,168)"}, {"label": "Saudi Arabia", "data": [{"x": 362878, "y": 125}], "backgroundColor": "rgb(13,168,212)"}, {"label": "Singapore", "data": [{"x": 58629, "y": 134}], "backgroundColor": "rgb(208,159,25)"}, {"label": "South Africa", "data": [{"x": 1073887, "y": 267}], "backgroundColor": "rgb(94,55,132)"}, {"label": "Spain", "data": [{"x": 1928265, "y": 422}], "backgroundColor": "rgb(124,144,199)"}, {"label": "France", "data": [{"x": 2697014, "y": 419}], "backgroundColor": "rgb(42,52,184)"}, {"label": "Thailand", "data": [{"x": 7379, "y": 212}], "backgroundColor": "rgb(30,237,70)"}, {"label": "Ukraine", "data": [{"x": 1096855, "y": 202}], "backgroundColor": "rgb(89,196,195)"}, {"label": "Sweden", "data": [{"x": 437379, "y": 131}], "backgroundColor": "rgb(31,49,180)"}, {"label": "Slovenia", "data": [{"x": 123950, "y": 73}], "backgroundColor": "rgb(84,204,162)"}, {"label": "Qatar", "data": [{"x": 144042, "y": 64}], "backgroundColor": "rgb(81,20,200)"}, {"label": "Portugal", "data": [{"x": 420629, "y": 57}], "backgroundColor": "rgb(159,73,94)"}, {"label": "Philippines", "data": [{"x": 475820, "y": 229}], "backgroundColor": "rgb(213,225,104)"}, {"label": "Panama", "data": [{"x": 249733, "y": 90}], "backgroundColor": "rgb(101,85,16)"}, {"label": "Nigeria", "data": [{"x": 88587, "y": 203}], "backgroundColor": "rgb(18,61,203)"}, {"label": "Netherlands", "data": [{"x": 816616, "y": 242}], "backgroundColor": "rgb(246,141,184)"}, {"label": "Nepal", "data": [{"x": 261019, "y": 141}], "backgroundColor": "rgb(34,240,115)"}, {"label": "Morocco", "data": [{"x": 440970, "y": 136}], "backgroundColor": "rgb(108,251,229)"}, {"label": "Mongolia", "data": [{"x": 1242, "y": 0}], "backgroundColor": "rgb(131,119,214)"}, {"label": "Mexico", "data": [{"x": 1437185, "y": 233}], "backgroundColor": "rgb(166,147,149)"}, {"label": "Lebanon", "data": [{"x": 183888, "y": 174}], "backgroundColor": "rgb(24,227,215)"}, {"label": "Japan", "data": [{"x": 239068, "y": 328}], "backgroundColor": "rgb(32,159,151)"}]};
        var trendline = {"label": "Trendline", "pointRadius":0, "showLine":true, "data":[{"x": 1.0, "y": 102.0}, {"x": 10034.441471571909, "y": 103.0}, {"x": 20067.88294314381, "y": 104.0}, {"x": 30101.324414715717, "y": 105.0}, {"x": 40134.765886287634, "y": 107.0}, {"x": 50168.20735785953, "y": 108.0}, {"x": 60201.64882943143, "y": 109.0}, {"x": 70235.09030100335, "y": 110.0}, {"x": 80268.53177257525, "y": 111.0}, {"x": 90301.97324414717, "y": 113.0}, {"x": 100335.41471571906, "y": 114.0}, {"x": 110368.85618729098, "y": 115.0}, {"x": 120402.29765886287, "y": 116.0}, {"x": 130435.73913043477, "y": 118.0}, {"x": 140469.1806020067, "y": 119.0}, {"x": 150502.6220735786, "y": 120.0}, {"x": 160536.0635451505, "y": 121.0}, {"x": 170569.50501672245, "y": 123.0}, {"x": 180602.94648829428, "y": 124.0}, {"x": 190636.38795986626, "y": 125.0}, {"x": 200669.8294314381, "y": 126.0}, {"x": 210703.27090301004, "y": 127.0}, {"x": 220736.71237458198, "y": 129.0}, {"x": 230770.15384615387, "y": 130.0}, {"x": 240803.59531772573, "y": 131.0}, {"x": 250837.0367892977, "y": 132.0}, {"x": 260870.4782608696, "y": 134.0}, {"x": 270903.9197324415, "y": 135.0}, {"x": 280937.3612040134, "y": 136.0}, {"x": 290970.8026755853, "y": 137.0}, {"x": 301004.2441471572, "y": 139.0}, {"x": 311037.6856187291, "y": 140.0}, {"x": 321071.127090301, "y": 141.0}, {"x": 331104.5685618729, "y": 142.0}, {"x": 341138.01003344485, "y": 143.0}, {"x": 351171.4515050167, "y": 145.0}, {"x": 361204.89297658857, "y": 146.0}, {"x": 371238.33444816055, "y": 147.0}, {"x": 381271.7759197325, "y": 148.0}, {"x": 391305.2173913044, "y": 150.0}, {"x": 401338.6588628762, "y": 151.0}, {"x": 411372.1003344481, "y": 152.0}, {"x": 421405.5418060201, "y": 153.0}, {"x": 431438.98327759205, "y": 155.0}, {"x": 441472.4247491639, "y": 156.0}, {"x": 451505.86622073577, "y": 157.0}, {"x": 461539.30769230775, "y": 158.0}, {"x": 471572.7491638796, "y": 159.0}, {"x": 481606.19063545146, "y": 161.0}, {"x": 491639.63210702344, "y": 162.0}, {"x": 501673.0735785954, "y": 163.0}, {"x": 511706.51505016716, "y": 164.0}, {"x": 521739.9565217392, "y": 166.0}, {"x": 531773.397993311, "y": 167.0}, {"x": 541806.839464883, "y": 168.0}, {"x": 551840.2809364549, "y": 169.0}, {"x": 561873.7224080268, "y": 171.0}, {"x": 571907.1638795987, "y": 172.0}, {"x": 581940.6053511706, "y": 173.0}, {"x": 591974.0468227424, "y": 174.0}, {"x": 602007.4882943144, "y": 175.0}, {"x": 612040.9297658863, "y": 177.0}, {"x": 622074.3712374582, "y": 178.0}, {"x": 632107.8127090301, "y": 179.0}, {"x": 642141.254180602, "y": 180.0}, {"x": 652174.695652174, "y": 182.0}, {"x": 662208.137123746, "y": 183.0}, {"x": 672241.5785953178, "y": 184.0}, {"x": 682275.0200668897, "y": 185.0}, {"x": 692308.4615384616, "y": 187.0}, {"x": 702341.9030100334, "y": 188.0}, {"x": 712375.3444816053, "y": 189.0}, {"x": 722408.7859531774, "y": 190.0}, {"x": 732442.2274247492, "y": 191.0}, {"x": 742475.6688963211, "y": 193.0}, {"x": 752509.110367893, "y": 194.0}, {"x": 762542.5518394648, "y": 195.0}, {"x": 772575.9933110368, "y": 196.0}, {"x": 782609.4347826088, "y": 198.0}, {"x": 792642.8762541807, "y": 199.0}, {"x": 802676.3177257525, "y": 200.0}, {"x": 812709.7591973244, "y": 201.0}, {"x": 822743.2006688962, "y": 203.0}, {"x": 832776.6421404681, "y": 204.0}, {"x": 842810.0836120402, "y": 205.0}, {"x": 852843.5250836121, "y": 206.0}, {"x": 862876.9665551841, "y": 207.0}, {"x": 872910.4080267559, "y": 209.0}, {"x": 882943.8494983278, "y": 210.0}, {"x": 892977.2909698997, "y": 211.0}, {"x": 903010.7324414715, "y": 212.0}, {"x": 913044.1739130436, "y": 214.0}, {"x": 923077.6153846155, "y": 215.0}, {"x": 933111.0568561872, "y": 216.0}, {"x": 943144.4983277592, "y": 217.0}, {"x": 953177.9397993312, "y": 219.0}, {"x": 963211.3812709029, "y": 220.0}, {"x": 973244.822742475, "y": 221.0}, {"x": 983278.2642140469, "y": 222.0}, {"x": 993311.7056856188, "y": 223.0}, {"x": 1003345.1471571908, "y": 225.0}, {"x": 1013378.5886287626, "y": 226.0}, {"x": 1023412.0301003343, "y": 227.0}, {"x": 1033445.4715719064, "y": 228.0}, {"x": 1043478.9130434784, "y": 230.0}, {"x": 1053512.3545150505, "y": 231.0}, {"x": 1063545.795986622, "y": 232.0}, {"x": 1073579.2374581941, "y": 233.0}, {"x": 1083612.678929766, "y": 235.0}, {"x": 1093646.1204013377, "y": 236.0}, {"x": 1103679.5618729098, "y": 237.0}, {"x": 1113713.0033444816, "y": 238.0}, {"x": 1123746.4448160536, "y": 239.0}, {"x": 1133779.8862876254, "y": 241.0}, {"x": 1143813.3277591974, "y": 242.0}, {"x": 1153846.7692307692, "y": 243.0}, {"x": 1163880.2107023413, "y": 244.0}, {"x": 1173913.652173913, "y": 246.0}, {"x": 1183947.093645485, "y": 247.0}, {"x": 1193980.535117057, "y": 248.0}, {"x": 1204013.9765886287, "y": 249.0}, {"x": 1214047.4180602008, "y": 250.0}, {"x": 1224080.8595317726, "y": 252.0}, {"x": 1234114.3010033446, "y": 253.0}, {"x": 1244147.7424749164, "y": 254.0}, {"x": 1254181.1839464884, "y": 255.0}, {"x": 1264214.6254180602, "y": 257.0}, {"x": 1274248.0668896323, "y": 258.0}, {"x": 1284281.508361204, "y": 259.0}, {"x": 1294314.9498327759, "y": 260.0}, {"x": 1304348.391304348, "y": 262.0}, {"x": 1314381.8327759195, "y": 263.0}, {"x": 1324415.2742474915, "y": 264.0}, {"x": 1334448.7157190635, "y": 265.0}, {"x": 1344482.1571906356, "y": 266.0}, {"x": 1354515.5986622074, "y": 268.0}, {"x": 1364549.0401337794, "y": 269.0}, {"x": 1374582.4816053512, "y": 270.0}, {"x": 1384615.9230769232, "y": 271.0}, {"x": 1394649.364548495, "y": 273.0}, {"x": 1404682.8060200668, "y": 274.0}, {"x": 1414716.2474916386, "y": 275.0}, {"x": 1424749.688963211, "y": 276.0}, {"x": 1434783.1304347827, "y": 278.0}, {"x": 1444816.5719063543, "y": 279.0}, {"x": 1454850.0133779263, "y": 280.0}, {"x": 1464883.4548494983, "y": 281.0}, {"x": 1474916.8963210704, "y": 282.0}, {"x": 1484950.3377926422, "y": 284.0}, {"x": 1494983.779264214, "y": 285.0}, {"x": 1505017.220735786, "y": 286.0}, {"x": 1515050.6622073578, "y": 287.0}, {"x": 1525084.10367893, "y": 289.0}, {"x": 1535117.5451505017, "y": 290.0}, {"x": 1545150.9866220737, "y": 291.0}, {"x": 1555184.4280936457, "y": 292.0}, {"x": 1565217.8695652175, "y": 294.0}, {"x": 1575251.311036789, "y": 295.0}, {"x": 1585284.7525083614, "y": 296.0}, {"x": 1595318.1939799332, "y": 297.0}, {"x": 1605351.635451505, "y": 298.0}, {"x": 1615385.0769230768, "y": 300.0}, {"x": 1625418.5183946488, "y": 301.0}, {"x": 1635451.9598662208, "y": 302.0}, {"x": 1645485.4013377924, "y": 303.0}, {"x": 1655518.8428093647, "y": 305.0}, {"x": 1665552.2842809362, "y": 306.0}, {"x": 1675585.7257525085, "y": 307.0}, {"x": 1685619.1672240803, "y": 308.0}, {"x": 1695652.6086956526, "y": 310.0}, {"x": 1705686.0501672241, "y": 311.0}, {"x": 1715719.491638796, "y": 312.0}, {"x": 1725752.9331103682, "y": 313.0}, {"x": 1735786.3745819398, "y": 314.0}, {"x": 1745819.8160535118, "y": 316.0}, {"x": 1755853.2575250838, "y": 317.0}, {"x": 1765886.6989966556, "y": 318.0}, {"x": 1775920.1404682274, "y": 319.0}, {"x": 1785953.5819397997, "y": 321.0}, {"x": 1795987.0234113713, "y": 322.0}, {"x": 1806020.4648829438, "y": 323.0}, {"x": 1816053.906354515, "y": 324.0}, {"x": 1826087.347826087, "y": 326.0}, {"x": 1836120.789297659, "y": 327.0}, {"x": 1846154.230769231, "y": 328.0}, {"x": 1856187.6722408028, "y": 329.0}, {"x": 1866221.1137123744, "y": 330.0}, {"x": 1876254.5551839462, "y": 332.0}, {"x": 1886287.9966555184, "y": 333.0}, {"x": 1896321.4381270902, "y": 334.0}, {"x": 1906354.8795986625, "y": 335.0}, {"x": 1916388.3210702343, "y": 337.0}, {"x": 1926421.7625418059, "y": 338.0}, {"x": 1936455.2040133781, "y": 339.0}, {"x": 1946488.64548495, "y": 340.0}, {"x": 1956522.0869565215, "y": 342.0}, {"x": 1966555.5284280938, "y": 343.0}, {"x": 1976588.9698996656, "y": 344.0}, {"x": 1986622.4113712376, "y": 345.0}, {"x": 1996655.8528428092, "y": 346.0}, {"x": 2006689.2943143812, "y": 348.0}, {"x": 2016722.7357859528, "y": 349.0}, {"x": 2026756.1772575253, "y": 350.0}, {"x": 2036789.6187290968, "y": 351.0}, {"x": 2046823.0602006686, "y": 353.0}, {"x": 2056856.501672241, "y": 354.0}, {"x": 2066889.9431438127, "y": 355.0}, {"x": 2076923.3846153847, "y": 356.0}, {"x": 2086956.8260869563, "y": 358.0}, {"x": 2096990.2675585288, "y": 359.0}, {"x": 2107023.709030101, "y": 360.0}, {"x": 2117057.1505016717, "y": 361.0}, {"x": 2127090.591973244, "y": 362.0}, {"x": 2137124.033444816, "y": 364.0}, {"x": 2147157.4749163883, "y": 365.0}, {"x": 2157190.91638796, "y": 366.0}, {"x": 2167224.357859532, "y": 367.0}, {"x": 2177257.799331104, "y": 369.0}, {"x": 2187291.2408026755, "y": 370.0}, {"x": 2197324.6822742475, "y": 371.0}, {"x": 2207358.12374582, "y": 372.0}, {"x": 2217391.565217392, "y": 374.0}, {"x": 2227425.006688963, "y": 375.0}, {"x": 2237458.448160535, "y": 376.0}, {"x": 2247491.8896321068, "y": 377.0}, {"x": 2257525.3311036793, "y": 378.0}, {"x": 2267558.772575251, "y": 380.0}, {"x": 2277592.2140468233, "y": 381.0}, {"x": 2287625.655518395, "y": 382.0}, {"x": 2297659.0969899665, "y": 383.0}, {"x": 2307692.5384615385, "y": 385.0}, {"x": 2317725.9799331105, "y": 386.0}, {"x": 2327759.4214046826, "y": 387.0}, {"x": 2337792.862876254, "y": 388.0}, {"x": 2347826.304347826, "y": 390.0}, {"x": 2357859.745819398, "y": 391.0}, {"x": 2367893.18729097, "y": 392.0}, {"x": 2377926.628762542, "y": 393.0}, {"x": 2387960.070234114, "y": 394.0}, {"x": 2397993.511705686, "y": 396.0}, {"x": 2408026.953177257, "y": 397.0}, {"x": 2418060.394648829, "y": 398.0}, {"x": 2428093.836120401, "y": 399.0}, {"x": 2438127.277591973, "y": 401.0}, {"x": 2448160.719063545, "y": 402.0}, {"x": 2458194.1605351167, "y": 403.0}, {"x": 2468227.602006689, "y": 404.0}, {"x": 2478261.0434782607, "y": 406.0}, {"x": 2488294.4849498332, "y": 407.0}, {"x": 2498327.926421405, "y": 408.0}, {"x": 2508361.367892977, "y": 409.0}, {"x": 2518394.8093645484, "y": 410.0}, {"x": 2528428.2508361205, "y": 412.0}, {"x": 2538461.6923076925, "y": 413.0}, {"x": 2548495.1337792645, "y": 414.0}, {"x": 2558528.575250836, "y": 415.0}, {"x": 2568562.016722408, "y": 417.0}, {"x": 2578595.45819398, "y": 418.0}, {"x": 2588628.8996655517, "y": 419.0}, {"x": 2598662.341137124, "y": 420.0}, {"x": 2608695.782608696, "y": 422.0}, {"x": 2618729.2240802683, "y": 423.0}, {"x": 2628762.66555184, "y": 424.0}, {"x": 2638796.1070234114, "y": 425.0}, {"x": 2648829.548494984, "y": 426.0}, {"x": 2658862.9899665555, "y": 428.0}, {"x": 2668896.431438127, "y": 429.0}, {"x": 2678929.872909699, "y": 430.0}, {"x": 2688963.314381271, "y": 431.0}, {"x": 2698996.7558528427, "y": 433.0}, {"x": 2709030.1973244147, "y": 434.0}, {"x": 2719063.638795987, "y": 435.0}, {"x": 2729097.0802675593, "y": 436.0}, {"x": 2739130.5217391304, "y": 438.0}, {"x": 2749163.9632107024, "y": 439.0}, {"x": 2759197.4046822744, "y": 440.0}, {"x": 2769230.8461538465, "y": 441.0}, {"x": 2779264.287625418, "y": 442.0}, {"x": 2789297.72909699, "y": 444.0}, {"x": 2799331.1705685616, "y": 445.0}, {"x": 2809364.6120401337, "y": 446.0}, {"x": 2819398.0535117057, "y": 447.0}, {"x": 2829431.4949832773, "y": 449.0}, {"x": 2839464.93645485, "y": 450.0}, {"x": 2849498.3779264214, "y": 451.0}, {"x": 2859531.819397993, "y": 452.0}, {"x": 2869565.260869565, "y": 454.0}, {"x": 2879598.7023411375, "y": 455.0}, {"x": 2889632.1438127086, "y": 456.0}, {"x": 2899665.585284281, "y": 457.0}, {"x": 2909699.026755853, "y": 458.0}, {"x": 2919732.468227425, "y": 460.0}, {"x": 2929765.9096989967, "y": 461.0}, {"x": 2939799.3511705687, "y": 462.0}, {"x": 2949832.7926421408, "y": 463.0}, {"x": 2959866.2341137123, "y": 465.0}, {"x": 2969899.6755852844, "y": 466.0}, {"x": 2979933.1170568564, "y": 467.0}, {"x": 2989966.558528428, "y": 468.0}, {"x": 3000000.0, "y": 469.0}]};
        data["datasets"].push(trendline)
         const xAxes_title = "x";
         const yAxes_title = "y";
         const options = {
           responsive: true,
           title: {
             display: true,
             text: xAxes_title + ' v ' + yAxes_title
           },
           tooltips: {
             callbacks: {
                label: function(tooltipItem, data) {
                   var label = data.datasets[tooltipItem.datasetIndex].label;
                   return label + ': (' + tooltipItem.xLabel + ', ' + tooltipItem.yLabel + ')';
                }
             }
           },
           scales: {
             yAxes: [
               {
                 scaleLabel: {
                   display: true,
                   labelString: xAxes_title
                 }
               }
             ],
             xAxes: [
               {
                 scaleLabel: {
                   display: true,
                   labelString: yAxes_title
                 }
               }
             ]
           }
         }

        graph = <Scatter data={data} options={options} />

    } else if (this.state.dataSelected === "google_sheets") {
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
            // eslint-disable-next-line array-callback-return
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

          for (var p in values) {
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
          // eslint-disable-next-line array-callback-return
          this.state.data.map(obj => {
            var val = obj["Y-Axis"].replace(/,/g, "");
            values.push(parseInt(val));
            labels.push(obj["X-Axis"])
          });

          //graph colours
          // eslint-disable-next-line no-redeclare
          // eslint-disable-next-line no-unused-vars
          for (var n in values) {
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
          // eslint-disable-next-line array-callback-return
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
          // eslint-disable-next-line array-callback-return
          this.state.data.map(obj => {
            var val = obj["Value"].replace(/,/g, "");
            values.push(parseInt(val));
            labels.push(obj["Segment Label"])
          });

          //graph colours
          // eslint-disable-next-line no-redeclare
          // eslint-disable-next-line no-unused-vars
          for (var _k in values) {
            var r4 = Math.floor(Math.random() * 255);
            var g4 = Math.floor(Math.random() * 255);
            var b4 = Math.floor(Math.random() * 255);
            var colour4= "rgb(" + r4 + "," + g4 + "," + b4 + ")";
            backgroundColours.push(colour4);
            hoverBackgroundColor.push("rgb(" + r4 + "," + g4 + "," + b4 + ", 0.7)");
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
          console.log(graph);
        }
    }

    var dataOptions = [
      { value: 'google_sheets', label: 'Google Sheets' },
      { value: 'promed_covid_data', label: 'Promed COVID Data' },
      { value: 'google_trends', label: 'Google Trends' }
    ]

    return (
      <ReactCardFlip isFlipped={this.state.isFlipped} flipDirection="horizontal">
        {/* FRONT OF CARD-- GRAPH */}
        <div className="regression-front" >
          <p><i class="fa fa-signal fa-fw"></i>Charts</p>
          <button><img src={Arrow} alt="" onClick={this.handleSheetsRefresh}/></button>
          <Select onChange={this.handleDataSelectChange} options={dataOptions}/>

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