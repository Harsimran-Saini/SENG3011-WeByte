import json
import psycopg2
import sys
import boto3
import itertools

#latest endpoint- returns json of top 50 latest articles
def lambda_handler(event, context):
    #url params
    response_json = {}
    articles = []
    flatten = itertools.chain.from_iterable
    #db connection info
    ENDPOINT="database-1.c8iucjwjdzap.ap-southeast-2.rds.amazonaws.com"
    PORT="5432"
    USR="postgres"
    REGION="ap-southeast-2"
    DBNAME="webyte_v2"
    
    #gets the credentials from .aws/credentials584228
    session = boto3.Session()
    client = session.client('rds')
    
    #connect to database using psycopg2 & query results
    conn = psycopg2.connect(host=ENDPOINT, port=PORT, dbname=DBNAME, user=USR, password="postgres")
    cur = conn.cursor()
    
    #if summary is set to true
    text = "a.main_text"
    key = 'main_text'
    if (event['queryStringParameters'] != None):
        keys = event['queryStringParameters'].keys()
        if "summary" in keys and event['queryStringParameters']['summary'] == 'T':
            text = "a.summary"
            key = 'summary'
        
    query = "SELECT distinct(a.id), a.url, a.date_of_publication, a.headline, " + text + ", r.id from articles a join reports r on a.id = r.article_id ORDER BY a.date_of_publication DESC LIMIT 50;" 
    cur.execute(query)
    articleRes = cur.fetchall()
    for article in articleRes:
        articleInfo = {}
        reportsList = []
        articleInfo['archive_id'] = article[0]
        articleInfo['url'] = article[1]
        articleInfo['date'] = str(article[2])
        articleInfo['headline'] = article[3]
        articleInfo[key] = article[4]
        
        #report id
        report_id = article[5]
        reportsInfo = {}
        
        #date query
        dateQuery = "SELECT time from reports r join report_times rt on r.id = rt.report_id WHERE r.id = '" + str(report_id) + "' order by rt.time;"
        cur.execute(dateQuery)
        dateList = cur.fetchall()
        #convert datetimes to strings
        allDatesList = [str(time) for time in list(flatten(dateList))]
        if len(allDatesList) > 1:
            reportsInfo["event_date"] =  allDatesList[0] + " to " + allDatesList[-1]
        elif len(allDatesList) == 1:
            reportsInfo["event_date"] =  allDatesList[0]
        else:
            reportsInfo["event_date"] = "No Event Date"
            
        #location query
        locQuery = "SELECT * from reports r join locations l on r.id = l.report_id WHERE r.id = '" + str(report_id) + "';"
        cur.execute(locQuery)
        locList = cur.fetchall()
        locationList = []
        for location in locList:
            locObj = {}
            locObj["country"] = location[4]
            locObj["location"] = location[5]
            locObj["geonames_id"] = location[6]
            locationList.append(locObj)
        
        reportsInfo["locations"] = locationList
        
        #disease query
        disQuery = "SELECT disease_id from reports r join report_diseases rd on r.id = rd.report_id WHERE r.id = '" + str(report_id) + "';"
        cur.execute(disQuery)
        diseaseList = cur.fetchall()
        reportsInfo["diseases"] = list(flatten(diseaseList)) 
        
        #syndrome query
        synQuery = "SELECT syndrome_id from reports r join report_syndromes rs on r.id = rs.report_id WHERE r.id = '" + str(report_id) + "';"
        cur.execute(synQuery)
        syndromeList = cur.fetchall()
        reportsInfo["syndromes"] = list(flatten(syndromeList)) 
        
        reportsList.append(reportsInfo)
        articleInfo['reports'] = reportsList
        articles.append(articleInfo)
    response_json["articles"] = articles
    
    resObject = {}
    resObject['statusCode'] = 200
    resObject['headers'] = {}
    resObject['headers']['Content-Type'] = 'application/json'
    resObject['body'] = json.dumps(response_json)
    return resObject