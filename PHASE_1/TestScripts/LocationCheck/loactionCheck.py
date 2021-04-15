import psycopg2
import pytest

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
            print("Failed to get DB connection: " + e)
            return None

#tests that look for reports where locations cannot be determined
#tests if the location is a url
def URL_test(cur):
    Query = """Select id, location from locations where country = 'unknown' and
                    (location like '%://%')"""
    cur.execute(Query)
    result = cur.fetchall()
    return result

#Relaxed country check test, checks to see if locations can be valid, relaxed test
#so there may be a few false positives
def relaxed_country_test(cur):
    Query = """select id, report_id,  country, location from locations where
                    country = 'unknown' and (location ~ '.*[0-9].*')  and
                        location not like '%://%';
            """
    cur.execute(Query)
    result = cur.fetchall()
    return result

#Stricter version of the above test, most locations are non valid however
#there might be slight information about the location that can be inferred
def strict_country_test(cur):
    Query = """select id, report_id,  country, location from locations where
                    country = 'unknown' and (location ~ '.*[0-9].*') and
                        (location !~* '.*[a-z] [a-z].*')
                            and location not like '%://%';

            """
    cur.execute(Query)
    result = cur.fetchall()
    return result

conn = getDBConnection()

cur = conn.cursor()

def test_URL():

    assert URL_test(cur) == []
    

def test_rexlaxed_country_test():

    assert relaxed_country_test(cur) == []

def test_strict_country_test():

    assert strict_country_test(cur) == []
