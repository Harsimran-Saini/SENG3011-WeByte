import React, { Component, useState, useEffect } from 'react';    
import { Scatter } from "react-chartjs-2";

function randomRGB() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    var colour= "rgb(" + r + "," + g + "," + b + ")";
    return colour;
}

function parseDatasets(data) {
    // todo 
    console.log("Parsing: " + data);
    var datasets = [];
    Object.keys(data).map(k => {
        var entry = {
            "label": k,
            "data": [{"y": data[k], "x": Math.random() * 100}],
            "backgroundColor": randomRGB()
        }
        datasets.push(entry);
    })
    console.log(data)
    return datasets;
}

var trendGraph = function TrendGraph(props) {
    const [keyword, setKeyword] = useState(props.props.keyword); 
    const [datasets, setDatasets] = useState([])

    useEffect(() => {
        // GET request using fetch inside useEffect React hook
        fetch('http://127.0.0.1:5000/trends/' + keyword)
        .then(response => response.json())
        .then(data => setDatasets(parseDatasets(data)))
        .catch(error => {
            console.log(error.code);
            console.log(error.stack);
            console.log("Could not load trends: " + error);
            setDatasets([]);
        })
    // empty dependency array means this effect will only run once (like componentDidMount in classes)
    }, []);

    var data = {"datasets": datasets}
    var yAxes_title = "Covid Cases"
    var xAxes_title = "Relative Search Interest: " + keyword
    //data and labels
    const options = {
        responsive: true,
        legend: {
            display: false
        },
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
    
    var graph = <Scatter data={data} options={options} />
    return graph;  
};     
        
export default trendGraph;