import psycopg2
import sys
import json
import constants
# psql --host=database-1.c8iucjwjdzap.ap-southeast-2.rds.amazonaws.com --port=5432 --username=postgres --password --dbname=webyte

# Will not commit any changes to db
DEBUG = True

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
    connection = getDBConnection()
    cur = connection.cursor()
    print(f"Found {len(articles)} articles...")

    # Upload articles
    for article in data[k]:
        print(f"Uploading: {article[HEADLINE_K]}")
        # ARTICLES: id, url, date_of_publication, headline, main_text
        insertQuery = """INSERT into Articles(id, url, date_of_publication, headline, main_text) 
                         VALUES (%s, %s, %s, %s, %s) 
                         ON CONFLICT DO NOTHING"""
        articleData = (article[ID_K], article[URL_K], article[DATE_K], article[HEADLINE_K], article[MAINTEXT_K])
        #print(cur.mogrify(insertQuery, articleData))
        cur.execute(insertQuery, articleData)
        

        
    # Upload reports
    reports = []
    locations = []
    diseases = []
    syndromes = []
    event_dates = []
    for article in data[k]:
        # Add article IDs to reports and add them to the list
        n = 0
        for report in article[REPORTS_K]:
            report[ARTICLEID_K] = article[ID_K]
            report[ID_K] = str(article[ID_K]) + "_" + str(n)
            reports.append(report)
            n += 1

    print(f"Found {len(reports)} reports...")
    for report in reports:
        # REPORTS: id, article_id
        insertQuery = "INSERT into Reports(id, article_id) VALUES (%s, %s)"
        reportData = (report[ID_K], report[ARTICLEID_K])
        print(cur.mogrify(insertQuery, reportData))
        cur.execute(insertQuery, reportData)

        # Create list of locations, diseases, 

        # Get list of locations
        for location in report[LOCATIONS_K]:
            location[REPORTID_K] = report[ID_K]
            locations.append(location)
    

        # Get list of disease relations
        if keyword not in report[DISEASES_K] and keyword in constants.DISEASE_LIST: 
            print(f"Adding {keyword} to diseases list")
            report[DISEASES_K].append(keyword)
        for disease in report[DISEASES_K]:
            diseases.append({
                NAME_K: disease,
                REPORTID_K: report[ID_K]
            })

        if keyword not in report[SYNDROMES_K] and keyword in constants.SYNDROME_LIST:
            print(f"Adding {keyword} to syndrome list")
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
    print(f"Found {len(locations)} locations...")
    for location in locations:
        # Add location to locations
        insertQuery = "INSERT into Locations(report_id, country, location) VALUES (%s, %s, %s)"
        locationData = (location[REPORTID_K], location[COUNTRY_K], location[LOCATION_K])
        print(cur.mogrify(insertQuery, locationData))
        cur.execute(insertQuery, locationData)

    print(f"Found {len(diseases)} diseases...")
    # Create disease rows
    for disease in diseases:
        insertQuery = "INSERT into Report_diseases(disease_id, report_id) VALUES (%s, %s)"
        diseaseData = (disease[NAME_K], disease[REPORTID_K])
        print(cur.mogrify(insertQuery, diseaseData))
        cur.execute(insertQuery, diseaseData)

    print(f"Found {len(syndromes)} syndromes...")
    # Create syndrome rows
    for syndrome in syndromes:
        insertQuery = "INSERT into Report_syndromes(syndrome_id, report_id) VALUES (%s, %s)"
        syndromeData = (syndrome[NAME_K], syndrome[REPORTID_K])
        print(cur.mogrify(insertQuery, syndromeData))
        cur.execute(insertQuery, syndromeData)

    print(f"Found {len(event_dates)} event_dates...")
    # Create event_date rows
    for date in event_dates:
        insertQuery = "INSERT into Report_times(report_id, time) VALUES (%s, %s)"
        dateData = (date[REPORTID_K], date[EVENTDATE_K])
        print(cur.mogrify(insertQuery, dateData))
        cur.execute(insertQuery, dateData)
    
    # Commit changes and exit
    if not DEBUG:
        connection.commit()
    connection.close()


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

# Lets you specify a file containing json to be uploaded
if __name__ == "__main__":   
    if len(sys.argv) != 2:
        print("Usage: python3 uploadDatafile.py [filepath]")
        exit(1)

    # Load json file
    dataFile= open(sys.argv[1])
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
        exit(1)
    
    # Upload articles
    uploadArticlesToDB(data[articleKey], articleKey)
    