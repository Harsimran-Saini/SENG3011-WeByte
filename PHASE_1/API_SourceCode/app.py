from flask import Flask
from flask import request
app = Flask(__name__)

@app.route("/")
def search():
    return "hello"
    key_terms = request.args.get("key_terms")
    location = request.args.get("location")
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    required_result_ids = set(getResultIDs(key_terms, location, start_date, end_date))

    found_results = queryDatabase(required_result_ids)

    found_result_ids = set(map(lambda x: x.getId(), found_results))
    missed_result_ids = found_result_ids.difference(required_result_ids)

    processed_results = processMissedResults(missed_result_ids)

    aggregated_results = found_results+processed_results

    return aggregated_results

# Perform search on site and webscrap ID of results
def getResultIDs(key_terms, location, start_date, end_date):
    pass

# Search database for given ids
def queryDatabase(required_ids):
    pass

# Webscrap data on given results
def processMissedResults(required_ids):
    pass