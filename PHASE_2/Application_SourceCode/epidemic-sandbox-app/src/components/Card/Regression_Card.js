import React, { useState, useEffect } from 'react'
import ReactCardFlip from "react-card-flip";
import "./Card.css";
import { Scatter } from "react-chartjs-2";
import Select from 'react-select'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

var countries = ['Australia','China', 'USA', 'Ghana', 'New Zealand', 'Russia'];

// filter by date, change api, filter by location
const countryFilter = [
  { value: 'australia', label: 'Australia' },
  { value: 'china', label: 'China' },
  { value: 'usa', label: 'USA' },
  { value: 'ghana', label: 'Ghana' },
  { value: 'newzealand', label: 'New Zealand' },
  { value: 'russia', label: 'Russia' },
  { value: 'world', label: 'World' }
]

const apiFilter = [
  { value: 'promed', label: 'PROMED-Mail (default)' },
  { value: 'who', label: 'World Health Organisation (WHO)' },
  { value: 'googlesheets', label: 'Google Sheets (Upload Your Own Data)' },
  { value: 'covid', label: 'COVID-19 API' }
]

// Scatter Plot Values
const values = [{
  x: 123,
  y: 232
}, {
  x: 134,
  y: 242
}, {
  x: 156,
  y: 268
}, {
  x: 178,
  y: 289
}, {
  x: 191,
  y: 301
}, {
  x: 218,
  y: 322
}];

//Generate list of unique colours for each data point
var dynamicColors = function() {
  var r = Math.floor(Math.random() * 255);
  var g = Math.floor(Math.random() * 255);
  var b = Math.floor(Math.random() * 255);
  return "rgb(" + r + "," + g + "," + b + ")";
};

const backgroundColours = []
for (var i in values) {
  var colour=dynamicColors();
  backgroundColours.push(colour);
}

//Graph titles
const xAxes_title = "News Reports";
const yAxes_title = "Cumulative Covid-19 Cases";

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

// Graph data info
const baseGraphData = {
  labels: ['Australia','China', 'USA', 'Ghana', 'New Zealand', 'Russia'],
  datasets: [{
    label: "Countries",
    data: values,
    pointRadius: 8,
    pointHoverRadius: 11,
    backgroundColor: backgroundColours
  }],
};

function createGraphData(plotPoints, labels) {
    const backgroundColours = []
    for (var i in labels) {
      var colour = dynamicColors();
      backgroundColours.push(colour);
    }

    return {
      labels: labels,
      datasets: [{
        label: "Countries",
        data: plotPoints,
        pointRadius: 8,
        pointHoverRadius: 11,
        backgroundColor: backgroundColours
      }],
    };
}

function createInitialGraphData(setGraphData) {
    countries = countries.map(e => e.replace(/\s+/g, '-').toLowerCase());
    var plot_points = {};

    const url = "https://nsg2nkvz9l.execute-api.ap-southeast-2.amazonaws.com/we-byte/covid-report-count-by-country";

    const request = new Request(url, {
        method: 'GET',
    })

    fetch(request)
    .then(res => {
        if (res.ok) {
            return res.json();
        } else {
            throw new Error("Invalid Response Code: "+res.status);
        }
    })
    .then(data => {
        countries.forEach(country => {
            const countryKey = country.replace(/-/g, ' ').toUpperCase();
            var reportsForCountry = 0;
            if (countryKey in data) {
                reportsForCountry = data[countryKey];
            }

            var newObject = {
                "x" :0,
                "y" : reportsForCountry
            };

            plot_points[country] = (newObject)

    //        const url = "https://api.covid19api.com/total/country/"+country+"/status/confirmed?from=2020-03-01T00:00:00Z&to=2020-04-01T00:00:00Z"
    //        fetch(url).then(res => res.json()).then(data => {
    //            plot_points[country]["x"] = data[data.length-1]["Cases"];
    //        });
        });

        var labels = []
        var dataPoints = []

        for (var key in plot_points) {
            labels.push(key);
            dataPoints.push(plot_points[key]);
        }

        const newGraphData = createGraphData(dataPoints, labels);
        setGraphData(newGraphData);
    })
    .catch(err => {
        console.log(err);
    })

    return baseGraphData;
}

const Card = () => {
    // flipped state
    const [isFlipped, setIsFlipped] = useState(false);
    
    const [startDate, setStartDate] = useState(new Date());

    const [graphData, setGraphData] = useState(baseGraphData);

    //if button is clicked
    const handleClick = () => {
        setIsFlipped(!isFlipped);
    };

    //if sidebar is opened or closed
    const [showSidebar, setShowSidebar] = useState(false)
    const onClickSidebar = () => {
      setShowSidebar(!showSidebar);
    };

    useEffect(() => {
        async function fetchData() {
            createInitialGraphData(setGraphData);
        }

        fetchData();
    }, []);

    return (
      <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">

        {/* FRONT OF CARD-- GRAPH */}
        <div className="regression-front" >
          { showSidebar ? <div className="nav">
        
        <button onClick={onClickSidebar}><i className="fa fa-times"></i></button>
        <p>Filters</p>
        
        <DatePicker className="date" selected={startDate} onChange={date => setStartDate(date)} />
        <Select className="cFilter" options={countryFilter} />
        <Select className="aFilter" options={apiFilter} />
        
      </div> : null }
          <p><i className="fa fa-signal fa-fw"></i>Charts</p>
          <div className="filtersButton">
            <button onClick={onClickSidebar}><i className="fa fa-bars"></i></button>
          </div>
          <hr/>
          <div className="chart" id="graph123">
            <Scatter data={data} options={options} />
          </div>
          <button onClick={handleClick}>Click to view Analysis</button>
          
        </div>


        {/* BACK OF CARD-- ANALYSIS TEXT */}
        <div className="regression-back">
          <text id="regression-back">
          <p><i class="fa fa-signal fa-fw"></i>Regression Analysis</p>
          <hr/>
          <div>
            <br/>
            <p>Some bs text from Wikipedia- DELETE!! Coronaviruses are a group of related RNA viruses that cause diseases in mammals and birds. In humans and birds, they cause respiratory tract infections that can range from mild to lethal. Mild illnesses in humans include some cases of the common cold (which is also caused by other viruses, predominantly rhinoviruses), while more lethal varieties can cause SARS, MERS, and COVID-19. In cows and pigs they cause diarrhea, while in mice they cause hepatitis and encephalomyelitis.</p>
            <p>Coronaviruses constitute the subfamily Orthocoronavirinae, in the family Coronaviridae, order Nidovirales, and realm Riboviria.[5][4] They are enveloped viruses with a positive-sense single-stranded RNA genome and a nucleocapsid of helical symmetry.[6] The genome size of coronaviruses ranges from approximately 26 to 32 kilobases, one of the largest among RNA viruses.[7] They have characteristic club-shaped spikes that project from their surface, which in electron micrographs create an image reminiscent of the solar corona, from which their name derives.[8]</p>
            <p>Coronaviruses constitute the subfamily Orthocoronavirinae, in the family Coronaviridae, order Nidovirales, and realm Riboviria.</p>
          </div>
          </text>
          <button onClick={handleClick}>Click to view Graph</button>
        </div>
      </ReactCardFlip>
    )
}

export default Card
