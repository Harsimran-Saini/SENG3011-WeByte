import psycopg2
import sys
import json

# Will not commit any changes to db
DEBUG = True

#Json keys
HEADLINE_K = "headline"
REPORTS_K = "reports"
MAINTEXT_K = "main_text"
SYNDROMES_K = "syndromes"
ID_K = "archive_id"
URL_K = "url"
DATE_K = "date"
ARTICLEID_K = "article_id"
DISEASES_K = ""

def uploadArticlesToDB(articles):
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
    for article in data[k]:
        # Add article IDs to reports and add them to the list
        for report in article[REPORTS_K]:
            report[ARTICLEID_K] = article
            reports.append(report)

    print(f"Found {len(reports)} reports...")
    for report in reports:
        # REPORTS: id, article_id
        insertQuery = "INSERT into Reports(article_id) VALUES (%s)"
        reportData = (report[ARTICLEID_K],)
        print(cur.mogrify(insertQuery, reportData))
        cur.execute(insertQuery, reportData)

        # Create list of locations, diseases, 

        # Create locations TODO
        for location in report:
            pass
    

        # Create disease relations TODO
        for disease in report[DISEASE_K]:
            pass 

        # Create syndrome relations TODO

        # Create location relations TODO

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
    uploadArticlesToDB(data[articleKey])