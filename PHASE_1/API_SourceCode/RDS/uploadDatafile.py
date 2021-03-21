import psycopg2
import sys
import json
import constants
import glob
import concurrent.futures
# psql --host=database-1.c8iucjwjdzap.ap-southeast-2.rds.amazonaws.com --port=5432 --username=postgres --password --dbname=webyte

# Will not commit any changes to db
DEBUG = False
LOGGING = 1 # Loggin level: 0 = none, 1 = minimal, 2 = more, 3 = all

#Json keys
HEADLINE_K = "headline"
REPORTS_K = "reports"
MAINTEXT_K = "main_text"
ID_K = "archive_id"
URL_K = "url"
DATE_K = "date"
ARTICLEID_K = "article_id"
REPORTID_K = "report_id"

# Reports keys
LOCATIONS_K = "locations"
DISEASES_K = "diseases"
SYNDROMES_K = "syndromes"
COUNTRY_K = "country"
LOCATION_K = "location"
EVENTDATE_K = "event_date"
NAME_K = "name"

def uploadArticlesToDB(articles, keyword):
    # Log in to database
    try:
        cur = connection.cursor()
    except Exception as e:
        print(e)
    
    log(f"Found {len(articles)} articles...", 1)

    # Upload articles
    for article in articles:
        log(f"Uploading: {article[HEADLINE_K]}", 2)
        # ARTICLES: id, url, date_of_publication, headline, main_text
        insertQuery = """INSERT into Articles(id, url, date_of_publication, headline, main_text) 
                         VALUES (%s, %s, %s, %s, %s) 
                         ON CONFLICT DO NOTHING"""
        articleData = (article[ID_K], article[URL_K], article[DATE_K], article[HEADLINE_K], article[MAINTEXT_K])
        log(cur.mogrify(insertQuery, articleData), 3)
        cur.execute(insertQuery, articleData)
        

        
    # Upload reports
    reports = []
    locations = []
    diseases = []
    syndromes = []
    event_dates = []
    for article in articles:
        # Add article IDs to reports and add them to the list
        n = 0
        for report in article[REPORTS_K]:
            report[ARTICLEID_K] = article[ID_K]
            report[ID_K] = str(article[ID_K]) + "_" + str(n)
            reports.append(report)
            n += 1

    for report in reports:
        # REPORTS: id, article_id
        insertQuery = "INSERT into Reports(id, article_id) VALUES (%s, %s) ON CONFLICT DO NOTHING"
        reportData = (report[ID_K], report[ARTICLEID_K])
        log(cur.mogrify(insertQuery, reportData), 3)
        cur.execute(insertQuery, reportData)

        # Get list of locations
        for location in report[LOCATIONS_K]:
            location[REPORTID_K] = report[ID_K]
            locations.append(location)
    

        # Get list of disease relations
        if keyword not in report[DISEASES_K] and keyword in constants.DISEASE_LIST: 
            log(f"Adding {keyword} to diseases list", 3)
            report[DISEASES_K].append(keyword)
        for disease in report[DISEASES_K]:
            diseases.append({
                NAME_K: disease,
                REPORTID_K: report[ID_K]
            })

        if keyword not in report[SYNDROMES_K] and keyword in constants.SYNDROME_LIST:
            log(f"Adding {keyword} to syndrome list", 3)
            report[DISEASES_K].append(keyword)
        # Get list of syndrome relations
        for syndrome in report[SYNDROMES_K]:
            syndromes.append({
                NAME_K: syndrome,
                REPORTID_K: report[ID_K]
            })
        
        # Get event dates
        for event_date in report[EVENTDATE_K]:
            event_dates.append({
                EVENTDATE_K: event_date,
                REPORTID_K: report[ID_K]
            })
    
    # Create location rows
    log(f"Found {len(locations)} locations...", 2)
    for location in locations:
        # Add location to locations
        insertQuery = "INSERT into Locations(report_id, country, location) VALUES (%s, %s, %s) ON CONFLICT DO NOTHING"
        locationData = (location[REPORTID_K], location[COUNTRY_K], location[LOCATION_K])
        log(cur.mogrify(insertQuery, locationData), 3)
        cur.execute(insertQuery, locationData)

    log(f"Found {len(diseases)} diseases...", 2)
    # Create disease rows
    for disease in diseases:
        insertQuery = "INSERT into Report_diseases(disease_id, report_id) VALUES (%s, %s) ON CONFLICT DO NOTHING"
        diseaseData = (disease[NAME_K], disease[REPORTID_K])
        log(cur.mogrify(insertQuery, diseaseData), 3)
        cur.execute(insertQuery, diseaseData)

    log(f"Found {len(syndromes)} syndromes...", 2)
    # Create syndrome rows
    for syndrome in syndromes:
        insertQuery = "INSERT into Report_syndromes(syndrome_id, report_id) VALUES (%s, %s) ON CONFLICT DO NOTHING"
        syndromeData = (syndrome[NAME_K], syndrome[REPORTID_K])
        log(cur.mogrify(insertQuery, syndromeData), 3)
        cur.execute(insertQuery, syndromeData)

    log(f"Found {len(event_dates)} event_dates...", 2)
    # Create event_date rows
    for date in event_dates:
        insertQuery = "INSERT into Report_times(report_id, time) VALUES (%s, %s) ON CONFLICT DO NOTHING"
        dateData = (date[REPORTID_K], date[EVENTDATE_K])
        log(cur.mogrify(insertQuery, dateData), 3)
        cur.execute(insertQuery, dateData)


# Get a database connection
def getDBConnection():
    ENDPOINT="database-1.c8iucjwjdzap.ap-southeast-2.rds.amazonaws.com"
    PORT="5432"
    USR="postgres"
    REGION="ap-southeast-2"
    DBNAME="webyte"
    PASSWORD="postgres"

    try:
        conn = psycopg2.connect(host=ENDPOINT, port=PORT, database=DBNAME, user=USR, password=PASSWORD)
        conn.autocommit = False
        return conn
    except Exception as e:
        # Fail to connect
        print("Failed to get DB connection: " + e)
        return None

def uploadFromFile(filename):
    
    # Load json file
    dataFile= open(filename)
    data = json.load(dataFile)

    # Get article key
    articleKey = None
    for k in data.keys():
        try:
            firstHeadline = data[k][0][HEADLINE_K]
            # No error, this is the key
            articleKey = k
        except Exception:
            # Not the articles key
            continue
    
    # If no key, exit
    if (articleKey == None):
        print("No articles found")
        return
    
    # Upload articles
    log(f"Uploading {len(data[articleKey])} articles from: {filename}", 0)
    uploadArticlesToDB(data[articleKey], articleKey)
    print(f"Finished uploading {filename}")

# Controls logging
def log(string, level):
    if (LOGGING >= level):
        print(string)


# Lets you specify a file containing json to be uploaded
if __name__ == "__main__":   
    connection = getDBConnection()
    if len(sys.argv) != 2:
        print("Usage: python3 uploadDatafile.py [folderPath]")
        exit(1)

    #with concurrent.futures.ThreadPoolExecutor() as executor:
    #    executor.map(uploadFromFile, glob.glob(sys.argv[1]))
    for filename in glob.glob(sys.argv[1]):
        uploadFromFile(filename)

    log("Finished", 0)
    # Commit changes and exit
    if not DEBUG:
        connection.commit()
    connection.close()
        

    