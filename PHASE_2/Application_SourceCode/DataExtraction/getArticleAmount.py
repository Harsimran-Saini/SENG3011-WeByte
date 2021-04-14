import requests
import pandas as pd
import numpy as np
import scipy.stats
import json
import scipy
import datetime
import psycopg2
import os

from getCovidCases import *
url='https://nsg2nkvz9l.execute-api.ap-southeast-2.amazonaws.com/we-byte/search-keywords?'

def getCountriesCovidData(start_date, end_date, list_of_countires):

    #first check to make sure directories have been set up, ExtractedData with
    #the subdirectory ConfirmedCovidCases within it
    countries=[]
    cases=[]
    numArticles=[]

    for country in list_of_countires:

        if getConfirmedCovidCases(country, start_date, end_date) == 1:
            print(f"Adding {country} data")
            countries.append(f"{country}")
            casesNum , articleNum = getCases_ArticleNum(start_date, end_date, country)
            cases.append(casesNum)
            numArticles.append(articleNum)




    data = {"Country":countries, "Cases":cases, "numArticles":numArticles}
    df = pd.DataFrame(data=data)
    print (df)
    df.to_csv("test", index=True)
    return

def getCases_ArticleNum(start_date, end_date, country):
    CovidCasesPath=f"ExtractedData/ConfirmedCovidCases/ConfirmedCovidCases_{country}.csv"
    df = pd.read_csv(CovidCasesPath)
    totalCases = df['Cases'].iloc[-1]

    articleNum=getArticleAmountDB(start_date, end_date, "Covid", country)

    return totalCases, articleNum


def getArticleAmount(key_terms, start_date, end_date, location):
    param={"key_terms":key_terms, "start_date":start_date,
                        "end_date":end_date, "location":location, "summary":"T"}
    r =requests.get("https://nsg2nkvz9l.execute-api.ap-southeast-2.amazonaws.com/we-byte/search-keywords", params=param)
    print(r.json)
    return

def getCorrelation(dataFile, x, y, isCSV=True):

    if isCSV==True:
        df=pd.read_csv(dataFile)
    else:
        #if it isnt a csv file it is a DF object
        df=dataFile

    x=df[x].to_numpy()
    y=df[y].to_numpy()
    pearson=scipy.stats.pearsonr(x, y)
    spearman=scipy.stats.spearmanr(x, y)
    kendall=scipy.stats.kendalltau(x, y)
    print(f"Pearson's correlation and p-value: {pearson}")
    print(f"Spearman's correlation and p-value: {spearman}")
    print(f"Kendall's correlation and p-value: {kendall}")
    return

def getDBConnection():
        ENDPOINT="database-1.c8iucjwjdzap.ap-southeast-2.rds.amazonaws.com"
        PORT="5432"
        USR="postgres"
        REGION="ap-southeast-2"
        DBNAME="webyte_v2"
        PASSWORD="postgres"

        try:
            conn = psycopg2.connect(host=ENDPOINT, port=PORT, database=DBNAME, user=USR, password=PASSWORD)
            conn.autocommit = False
            return conn
        except Exception as e:
            # Fail to connect
            print(f"Failed to get DB connection: {e}")
            return None

def getArticleAmountDB(start_date,end_date,keyword, country):

    conn = getDBConnection()
    cur = conn.cursor()
    Query = f"""SELECT Count(*) from Articles
                JOIN Reports ON Articles.id=Reports.article_id
                JOIN Locations ON Locations.report_id=Reports.id
                JOIN Report_diseases rd ON rd.report_id=Reports.id
                WHERE Articles.date_of_publication >='{start_date}'
                    and Articles.date_of_publication <= '{end_date}'

                    and UPPER(Locations.country)=UPPER('{country}')
                    and UPPER(rd.disease_id) ilike UPPER('%{keyword}%')

                    """
    cur.execute(Query)
    result = cur.fetchall()

    return result[0][0]
