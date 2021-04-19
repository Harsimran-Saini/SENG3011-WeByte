import React, { useState, useEffect } from 'react';    
import { Scatter } from "react-chartjs-2";

function randomRGB() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    var colour= "rgb(" + r + "," + g + "," + b + ")";
    return colour;
}

function parseDatasets(data, covidData) {
    // todo 
    console.log("Parsing: " + data);
    var datasets = [];
    // eslint-disable-next-line array-callback-return
    Object.keys(data).map(k => {
        try {
            var entry = {
                "label": k,
                "data": [{"y": data[k], "x": covidData[k]}],
                "backgroundColor": randomRGB()
            }
            datasets.push(entry);
        } catch {
            // Ignore invalid entries
        }
        
    })
    console.log(data)
    return datasets;
}

var trendGraph = function TrendGraph(props) {
    // eslint-disable-next-line no-unused-vars
    const { keyword: [keyword, setKeyword] } = {
        keyword: useState(''),
        ...(props.state || {})
    };
    const [datasets, setDatasets] = useState([]);
    const [covidData, setCovidData] = useState({});
    
    // Get covid data
    useEffect(() => {
        var path = 'http://127.0.0.1:5000/covid-by-country';
        console.log("Request made to: " + path)
        fetch(path)
        .then(response => response.json())
        .then(data => {setCovidData(data); console.log(data)})
        .catch(error => {
            console.log(error.code);
            console.log(error.stack);
            console.log("Could not load trends: " + error);
            setDatasets([]);
        })
    }, []);

    // Get trend data
    useEffect(() => {
        if (keyword !== "") {
            var path = 'http://127.0.0.1:5000/trends/' + keyword;
            console.log("Request made to: " + path)
            fetch(path)
            .then(response => response.json())
            .then(data => setDatasets(parseDatasets(data, covidData)))
            .catch(error => {
                console.log(error.code);
                console.log(error.stack);
                console.log("Could not load trends: " + error);
                setDatasets([]);
            })
        }
        
    // will update when keyword changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keyword]);

    var data = {"datasets": datasets}
    var yAxes_title = "Covid Cases"
    var xAxes_title = "Search interest for '" + keyword + "'"
    //data and labels
    const options = {
        responsive: true,
        legend: {
            display: false
        },
        title: {
            display: true,
            text: xAxes_title + ' v ' + yAxes_title + " by country"
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
                    type: 'logarithmic',
                    scaleLabel: {
                        display: true,
                        labelString: yAxes_title
                    }
                }
            ]
        }
    }
    
    var graph = 
    <>
        <Scatter data={data} options={options} />
    </>
    return graph;  
};     
        
export default trendGraph;