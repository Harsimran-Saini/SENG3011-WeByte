from urllib.request import urlopen # Web client
from urllib.request import Request
import json


def search_by_keyword (keyword):
    # URl to web scrap from.
    page_url="http://search-promed-en-fxxmsfyg24tcbr2vohkeahm3f4.us-east-1.cloudsearch.amazonaws.com/2013-01-01/search?q="+keyword+"&q.options={fields:%20[%27title%27]}&return=archive_id,date,title&sort=date%20desc,archive_id%20desc&size=500"

    req = Request(page_url, headers={'User-Agent': 'Mozilla/5.0'})

    # opens the connection and downloads html page from url
    uClient = urlopen(req)

    my_html = uClient.read().decode('utf-8')

    response_json =json.loads(my_html) 

    uClient.close()
    return response_json


def put_into_csv (response_json):
    out_filename = "covid_cases.csv"
    # header of csv file to be written
    headers = "archive_id, title, date \n"

    # opens file, and writes headers
    f = open(out_filename, "w")
    f.write(headers)

    for entry in response_json["hits"]["hit"]:
        archive_id = entry["fields"]["archive_id"]

        title = entry["fields"]["title"].strip()

        date = entry["fields"]["date"]


        # writes the dataset to file
        f.write(date + ", " + archive_id + ", " + title.replace(",", "|") + "\n")

    f.close()  # Close the file

if __name__ == "__main__":
    json = search_by_keyword("measles")
    put_into_csv(json)
