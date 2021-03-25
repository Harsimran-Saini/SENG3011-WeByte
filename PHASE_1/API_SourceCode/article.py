import json
import psycopg2
import sys
import boto3
import itertools



#article id endpoint- returns json of single article
def lambda_handler(event, context):
    #url params
    response_json = {}
    articles = []
    
    #check if parameters are provided
    if (event['queryStringParameters'] == None):
        resObject = {}
        resObject['statusCode'] = 400
        resObject['headers'] = {}
        resObject['headers']['Content-Type'] = 'application/json'
        resObject['body'] = json.dumps({"Error": "Please enter an id parameter", "id": "Must be a valid article id i.e. /article?id=3915783" }, indent=2)
        return resObject 
    
    keys = event['queryStringParameters'].keys()

    if "id" not in keys:
        resObject = {}
        resObject['statusCode'] = 400
        resObject['headers'] = {}
        resObject['headers']['Content-Type'] = 'application/json'
        resObject['body'] = json.dumps({"Error": "Please enter an id parameter", "id": "Must be a valid article id i.e. /article?id=3915783" }, indent=2)
        return resObject 
        
    #if summary is set to true
    text = "a.main_text"
    key = 'main_text'
    if "summary" in keys and event['queryStringParameters']['summary'] == 'T':
        text = "a.summary"
        key = 'summary'
        
    article_id = event['queryStringParameters']['id']
    
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
    
    token = client.generate_db_auth_token(DBHostname=ENDPOINT, Port=PORT, DBUsername=USR, Region=REGION)
    
    try:
        #connect to database using psycopg2 & query results
        conn = psycopg2.connect(host=ENDPOINT, port=PORT, dbname=DBNAME, user=USR, password="postgres")
        cur = conn.cursor()
        query = "SELECT distinct(a.id), a.url, a.date_of_publication, a.headline, " + text + ", r.id from articles a join reports r on a.id = r.article_id WHERE a.id = " + article_id + " LIMIT 1;" 
    
    
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
    except Exception as e:
        resObject = {}
        resObject['statusCode'] = 502
        resObject['headers'] = {}
        resObject['headers']['Content-Type'] = 'application/json'
        resObject['body'] = {"Error": "Please enter valid arguments"}
        
        return resObject