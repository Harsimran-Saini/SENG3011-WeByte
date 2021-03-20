import psycopg2
import sys
import boto3

ENDPOINT="database-1.c8iucjwjdzap.ap-southeast-2.rds.amazonaws.com"
PORT="5432"
USR="postgres"
REGION="ap-southeast-2"
DBNAME="webyte"

#gets the credentials from .aws/credentials
session = boto3.Session()
client = session.client('rds')

try:
    conn = psycopg2.connect(host=ENDPOINT, port=PORT, database=DBNAME, user=USR, password="postgres")
    cur = conn.cursor()
    cur.execute("""SELECT now()""")
    query_results = cur.fetchall()
    print(query_results)
except Exception as e:
    print("Database connection failed due to {}".format(e))                
                