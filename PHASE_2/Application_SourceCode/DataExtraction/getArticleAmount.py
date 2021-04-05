import requests
import pandas as pd
import json
import scipy
import datetime

url='https://nsg2nkvz9l.execute-api.ap-southeast-2.amazonaws.com/we-byte/search-keywords?'

def getArticleAmount(key_terms, start_date, end_date, location):
    param={"key_terms":key_terms, "start_date":start_date,
                        "end_date":end_date, "location":location, "summary":"T"}
    r =requests.get("https://nsg2nkvz9l.execute-api.ap-southeast-2.amazonaws.com/we-byte/search-keywords", params=param)
    print(r.json)
    return

def getCorrelation(dataFile):

    df=pd.read_csv(dataFile)
    days=pd.Series(range(0,170))
    cases=df['Cases']
    print(f"Pearson's correlation: {days.corr(cases)}")
    print(f"Spearman's correlation: {days.corr(cases, method='spearman')}")
    print(f"Kendall's correlation: {days.corr(cases, method='kendall')}")
    return
