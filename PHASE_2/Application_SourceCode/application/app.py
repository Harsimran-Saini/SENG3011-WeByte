import json
from flask import Flask, render_template, request, jsonify
from DataExtraction.extract_CSV_data import extractData
from DataExtraction.getCovidCases import getConfirmedCovidCases

app = Flask(__name__)


@app.route('/')
def main():
    return render_template('test.html', team_name="Analytica")


@app.route('/yeet')
def yeet():
    # country = request.args.get('country')
    # start_date = request.args.get('start_date')
    # end_date = request.args.get('end_date')

    country = "Australia"
    start_date = "2020-01-01"
    end_date = "2020-05-01"

    df = getConfirmedCovidCases(country, start_date, end_date)
    confirmed_cases_json = extractData(df)

    print(confirmed_cases_json)

    return {
        "confirmed_cases": confirmed_cases_json
    }


if __name__ == "__main__":
    app.run()
