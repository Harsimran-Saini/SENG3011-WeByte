import React, { Component } from 'react';


export default class ChartPage extends Component {
    render() {
        return (
            <div id="container" style={{"padding": "0px 10px 0px 10px",  "marginTop": "15px"}}>
                <h3>
                    COVID-19 Analyser
                </h3>
                <p>
                    Charting the outbreak in each country against the number of news reports (relevant to the appropriate outbreak) allows us to see the succession of events as a global story. Because the epidemic began at different times in different countries, viewing each country’s curve from the same starting point can allow us to more easily compare countries and the efficiency of displaying positive cases in the media. The starting point for this chart is the day on which the 1st case was confirmed in each country, with the trend lines following the number of days since that event. As with the health map, hovering over the data points on the map, displays a popup showing the country and relevant information regarding the disease.
                </p>

                <div style={{"display":"flex"}}>
                <button className="btn btn-primary" style={{"width":"100%", "marginRight":"10px"}}>
                        Add/Select Data
                    </button>

                    <input type="text" id="country_input" className="form-control form-control-sm" placeholder="Country" style={{"marginRight":"10px"}}/>
                    <input type="datetime" id="start_date_input" className="form-control form-control-sm" placeholder="Start Date" style={{"marginRight":"10px"}}/>
                    <input type="datetime" id="end_date_input" className="form-control form-control-sm" placeholder="End Date" style={{"marginRight":"10px"}}/>

                    <button id="refresh_graph" className="btn btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                    </button>
                </div>

                <hr/>

                <div>
                <canvas id="stockChart"></canvas>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
                <script src="./graph.js"></script>
                <script src="./updateGraph.js"></script>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css"/>

                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6" crossOrigin="anonymous"/>
                <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossOrigin="anonymous"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossOrigin="anonymous"></script>
                <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossOrigin="anonymous"></script>
                <script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.3"></script>
                <script src="https://cdn.jsdelivr.net/npm/moment@2.27.0"></script>
                <script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-moment@0.1.1"></script>
            </div>
        );
    }
}
