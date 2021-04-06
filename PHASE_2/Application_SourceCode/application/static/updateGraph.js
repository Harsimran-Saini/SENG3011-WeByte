api_url = "http://localhost:5000"

function randomNumber(min, max) {
    return Math.floor(Math.random()*(max-min))+min;
}

function resetCovidCasesGraph(chart, cases) {
    console.log(chart.data.datasets);
    cases.forEach((_case) => {
        chart.data.datasets[0].data.push(_case);
    })

    chart.update();
}

function resetCovidReportsGraph(chart, reports) {
    reports.forEach((report) => {
        chart.data.datasets[1].data.push(report);
    })

    chart.update();
}


function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

var refresh_graph = document.getElementById("refresh_graph");
refresh_graph.addEventListener("click", function() {
    var url = api_url+"/yeet";

    var country = document.getElementById("country_input").value;
    var start_date = document.getElementById("start_date_input").value;
    var end_date = document.getElementById("end_date_input").value;

    var url = new URL(api_url+"/yeet"),
    params = {
        country:country,
        start_date:start_date,
        end_date:end_date
    }
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

    fetch(url)
        .then(res => res.json())
        .then(data => {
            resetCovidCasesGraph(lineChart, data.confirmed_cases);

            var curr_moment = moment(start_date);
            var end_moment = moment(end_date);
            var curr_reports = randomNumber(0,10);


            var points = [];

            while (curr_moment < end_moment) {
                const curr_point =  {
                    x : curr_moment,
                    y : curr_reports
                }

                points.push(curr_point);

                curr_reports = curr_reports + randomNumber(1,10)*randomNumber(1,10);

                curr_moment.add(1,"days");
            }

            resetCovidReportsGraph(lineChart, points);



//            var url = new URL("https://nsg2nkvz9l.execute-api.ap-southeast-2.amazonaws.com/we-byte/search-keywords"),
//            params = {
//                key_terms:"[\"COVID\"]",
//                location:country,
//                start_date:start_date,
//                end_date:end_date
//            }
//            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
//            fetch(url, { mode: 'no-cors'})
//                .then(res => {
//                    if (res.ok) {
//                        return res.json()
//                    } else {
//                        console.log(res.status)
//                        throw Promise.reject(res.text());
//                    }
//                })
//                .then(data => {
//                    var reports = data[0]["reports"]
//                    var report_dates = reports.map(x => x.event_date[0]);
//
//                    var previous = 0;
//
//                    tally_report_dates = {};
//
//                    report_dates.forEach(date => {
//                        if (tally_report_dates.hasOwnProperty(date)) {
//                            tally_report_dates[date] = tally_report_dates[date]+1;
//                        } else {
//                            tally_report_dates[date] = 1;
//                        }
//                    });
//
//                    graphable_reports = []
//
//                    for (var key of Object.keys(tally_report_dates)) {
//                        const datapoint = {
//                            "x":key,
//                            "y":tally_report_dates[key]
//                        }
//                        graphable_reports.push(datapoint);
//                    };
//
//                    resetCovidReportsGraph(lineChart, graphable_reports);
//                })
//                .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
});
