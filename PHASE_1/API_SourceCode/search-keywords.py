import json
import boto3
import psycopg2
from ast import literal_eval
import itertools
from datetime import datetime, timedelta
from dateutil.parser import parse

def lambda_handler(event, context):
    #url params
    response_json = {}
    counter = 0
    query = ""
    error = "false"
    flatten = itertools.chain.from_iterable
    res_json = {}
    
    #time accessed
    now = datetime.now() + timedelta(hours=11)
    dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
    
    #log information
    log = {}
    log['time_accessed'] = dt_string
    log['data_source'] = "promedmail.org"
    log['team_name'] = "We-Byte"
    
    res_json['log_output'] = log
    
    #if no params are supplied
    if (event['queryStringParameters'] == None):
        resObject = {}
        resObject['statusCode'] = 400
        resObject['headers'] = {}
        resObject['headers']['Content-Type'] = 'application/json'
        resObject['body'] = json.dumps({"Error": "Please enter a start and end date", "start_date": "Must be in format yyyy-MM-ddTHH:mm:ss", "end_date": "Must be in format yyyy-MM-ddTHH:mm:ss" }, indent=2)
        
        logOutput = {}
        logOutput['statusCode'] = 200
        logOutput['headers'] = {}
        logOutput['headers']['Content-Type'] = 'application/json'
        logOutput['time_accessed'] = dt_string
        logOutput['data_source'] = "promedmail.org"
        logOutput['body'] = json.dumps({"Error": "Please enter a start and end date", "start_date": "Must be in format yyyy-MM-ddTHH:mm:ss", "end_date": "Must be in format yyyy-MM-ddTHH:mm:ss" }, indent=2)
        
        print(json.dumps(logOutput))
        
        return resObject 

    keys = event['queryStringParameters'].keys()
    
    #if start or end date params are missing
    if "start_date" not in keys:
        error = "Please enter a start date in the format: start_date="
    elif "end_date" not in keys: 
        error = "Please enter an end date in the format: end_date="
    else:
        if not validDateString(event['queryStringParameters']['start_date']) or not validDateString(event['queryStringParameters']['end_date']):
            error = "start_date and end_date must be in the format "
        if not checkEnd(event['queryStringParameters']['start_date'], event['queryStringParameters']['end_date']):
            error = "end_date must be greater or equal to start date in the format "

    
    #throw error
    if error != "false":
        resObject = {}
        resObject['statusCode'] = 400
        resObject['headers'] = {}
        resObject['headers']['Content-Type'] = 'application/json'
        resObject['body'] = json.dumps({"Error": error + "yyyy-MM-ddTHH:mm:ss"  }, indent = 2)
        
        logOutput = {}
        logOutput['statusCode'] = 200
        logOutput['headers'] = {}
        logOutput['headers']['Content-Type'] = 'application/json'
        logOutput['time_accessed'] = dt_string
        logOutput['data_source'] = "promedmail.org"
        logOutput['body'] = json.dumps({"Error": error + "yyyy-MM-ddTHH:mm:ss"  }, indent = 2)
        
        print(json.dumps(logOutput))
        
        return resObject 
    
    start_date = event['queryStringParameters']['start_date']
    end_date = event['queryStringParameters']['end_date']

    #string($yyyy-MM-dd HH:mm:ss)
    
    # #db connection info
    ENDPOINT="database-1.c8iucjwjdzap.ap-southeast-2.rds.amazonaws.com"
    PORT="5432"
    USR="postgres"
    REGION="ap-southeast-2"
    DBNAME="webyte_v2"
    
    # #gets the credentials from .aws/credentials584228
    session = boto3.Session()
    client = session.client('rds')
    
    #connect to database using psycopg2 & query results
    conn = psycopg2.connect(host=ENDPOINT, port=PORT, dbname=DBNAME, user=USR, password="postgres")
    cur = conn.cursor()
    
    if "key_terms" in keys:
        keywords = event['queryStringParameters']['key_terms']
        my_list = literal_eval(keywords)
        for elem in my_list:
            text = "a.main_text"
            key = 'main_text'
            if "summary" in keys and event['queryStringParameters']['summary'] == 'T':
                text = "a.summary"
                key = 'summary'

            if "location" in keys:
                locationQuery = event['queryStringParameters']["location"]
                query = "SELECT distinct(a.id), a.url, a.date_of_publication, "
                query += "a.headline, " + text + ", r.id FROM articles a join reports r "
                query += "on a.id = r.article_id join locations l on l.report_id = r.id "
                query += "where a.date_of_publication <= '" + str(end_date) + "' and "
                query += "a.date_of_publication >= '"+ str(start_date) + "'"
                query += "and (UPPER(l.location) = UPPER('" + str(locationQuery) + "') or "
                query += "UPPER(l.country) = UPPER('" + str(locationQuery) + "') ) "
                query += "and UPPER(a.headline) iLIKE UPPER('%" + str(elem) + "%') "
                query += "order by date_of_publication LIMIT 100" 
                
            else: 
                query = "SELECT distinct(a.id), a.url, a.date_of_publication, "
                query += "a.headline, " + text + ", r.id FROM articles a join reports r "
                query += "on a.id = r.article_id "
                query += "join report_diseases rd on rd.report_id = r.id "
                query += "join report_syndromes rs on rs.report_id = r.id "
                query += "where a.date_of_publication <= '" + str(end_date) + "' and "
                query += "a.date_of_publication >= '"+ str(start_date) + "' "
                query += "and ((UPPER(rd.disease_id) iLIKE UPPER('%" + str(elem) + "%')) "
                query += "or (UPPER(rs.syndrome_id) iLIKE UPPER('%" + str(elem) + "%')) "
                query += "or (UPPER(a.headline) iLIKE UPPER('%" + str(elem) + "%'))) "
                query += "order by date_of_publication LIMIT 100"
                
            cur.execute(query)
            articleRes = cur.fetchall()
            articles = []
            for article in articleRes:
                if (counter > 150):
                    break
                articleInfo = {}
                reportsList = []
                articleInfo['archive_id'] = article[0]
                articleInfo['url'] = article[1]
                articleInfo['date'] = str(article[2])
                articleInfo['headline'] = article[3]
                if (key == "main_text"):
                    articleInfo["main_text"] = article[4]
                    articleInfo["summary"] = ""
                else:
                    articleInfo["main_text"] = ""
                    articleInfo["summary"] = article[4]
                
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
                counter = counter + 1
            
            response_json[elem] = articles
        res_json['articles'] = response_json

    else:
        text = "a.main_text"
        key = 'main_text'
        if "summary" in keys and event['queryStringParameters']['summary'] == 'T':
            text = "a.summary"
            key = 'summary'
        if "location" in keys:
            locationQuery = event['queryStringParameters']["location"]
            query = "SELECT distinct(a.id), a.url, a.date_of_publication, "
            query += "a.headline, " + text + ", r.id FROM articles a join reports r "
            query += "on a.id = r.article_id join locations l on l.report_id = r.id "
            query += "where a.date_of_publication <= '" + str(end_date) + "' and "
            query += "a.date_of_publication >= '"+ str(start_date) + "'"
            query += "and (UPPER(l.location) = UPPER('" + str(locationQuery) + "') or "
            query += "UPPER(l.country) = UPPER('" + str(locationQuery) + "') ) "
            query += "order by date_of_publication LIMIT 100" 
            
        else: 
            query = "SELECT distinct(a.id), a.url, a.date_of_publication, "
            query += "a.headline, " + text + ", r.id FROM articles a join reports r "
            query += "on a.id = r.article_id "
            query += "where a.date_of_publication <= '" + str(end_date) + "' and "
            query += "a.date_of_publication >= '"+ str(start_date) + "' "
            query += "order by date_of_publication LIMIT 100"
                
        cur.execute(query)
        articleRes = cur.fetchall()
        articles = []
        for article in articleRes:
            if (counter > 150):
                break
            articleInfo = {}
            reportsList = []
            articleInfo['archive_id'] = article[0]
            articleInfo['url'] = article[1]
            articleInfo['date'] = str(article[2])
            articleInfo['headline'] = article[3]
            if (key == "main_text"):
                articleInfo["main_text"] = article[4]
                articleInfo["summary"] = ""
            else:
                articleInfo["main_text"] = ""
                articleInfo["summary"] = article[4]
            
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
            counter = counter + 1
        res_json['articles'] = articles
        #response_json[] = articles
    
    
    
    resObject = {}
    resObject['statusCode'] = 200
    resObject['headers'] = {}
    resObject['headers']['Content-Type'] = 'application/json'
    resObject['body'] = json.dumps(res_json)

    logOutput = {}
    logOutput['statusCode'] = 200
    logOutput['headers'] = {}
    logOutput['headers']['Content-Type'] = 'application/json'
    logOutput['time_accessed'] = dt_string
    logOutput['data_source'] = "promedmail.org"
    logOutput['body'] = json.dumps(res_json)
    
    print(json.dumps(logOutput))
        
    return resObject
    
def validDateString(date_string):
    try:
        parse(date_string)
        return True
    except Exception:
        return False
        
def checkEnd(start, end):
    if (end < start):
        return False
    else:
        return True
