import requests
import pandas as pd
import json
import re
from extract_CSV_data import *
"""
Description:

    gets the amount fo confirmed covid cases from a given start and end date in
    a particular country.

Input:
    country: lower case string of country, for countires with two or more words
             use "-" as spaces

    start_date: in the format of YYYY-MM-DD

    end_date: same as above

    daily: defaults in calculating the daily confimred cases
Returns:
    creates a CSV file with the name f"ConfirmedCovidCases_{country}.csv" which
    is then used by the extractData function to create
    "ConfirmedCovidCases_{country}.csv_extractedData.json" which is formatted to
    be used with Chart JS
"""

def getConfirmedCovidCases(country,start_date,end_date, daily=True):

    if daily:
        #gets the cases from the start of each specified date. So end date not inclusive
        param = {"from":f"{start_date}T00:00:00Z", "to":f"{end_date}T00:00:00Z"}
        r = requests.get(f"https://api.covid19api.com/country/{country}/status/confirmed", params=param)
        print(r.json)
        data= r.json()
        time = []
        cases = []

        for i in data:

            if i["Status"] == "confirmed":
                date = i['Date']
                try:
                    date = re.search('^(.*)T.*', date).group(1)
                except AttributeError:
                    print("Can't get valid date from API country confimred cases response")
                    raise

                time.append(date)
                cases.append(i["Cases"])

        d = {"Date":time, "Cases":cases}
        df = pd.DataFrame(data=d)
        df = df.groupby("Date").sum()
        print(df)
        #export as csv file
        fileName=f"ConfirmedCovidCases_{country}.csv"
        df.to_csv(fileName, index=True)

        extractData(fileName)
