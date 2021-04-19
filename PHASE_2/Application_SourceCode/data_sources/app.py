from trends import trends_by_country
from datetime import date
from dateutil import parser
import pandas
import json
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/trends/<keyword>')
def trends_country(keyword, keyword2):
    print("KEYWORD:" + keyword)
    if keyword == None:
        return "400 invalid keyword"
    end_date = date.today()
    start_date = end_date.replace(year=end_date.year - 1)
    df = trends_by_country(keyword, start_date, end_date)

    return json.dumps(json.loads(df.to_json())[keyword])
