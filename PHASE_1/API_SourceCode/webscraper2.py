from urllib.request import urlopen # Web client
from bs4 import BeautifulSoup as soup 
from urllib.request import Request
import json
from requests_html import HTMLSession


def search_by_keyword (keyword):
    # URl to web scrap from.
    page_url="http://search-promed-en-fxxmsfyg24tcbr2vohkeahm3f4.us-east-1.cloudsearch.amazonaws.com/2013-01-01/search?q="+str(keyword)+"&q.options={fields:%20[%27title%27]}&return=archive_id,date,title&sort=date%20desc,archive_id%20desc"

    req = Request(page_url, headers={'User-Agent': 'Mozilla/5.0'})

    # opens the connection and downloads html page from url
    uClient = urlopen(req)

    my_html = uClient.read().decode('utf-8')

    response_json =json.loads(my_html) 
    uClient.close()
    
    #how many articles were found
    number_of_articles = response_json["hits"]["found"]
    if number_of_articles != 0:
        page_url= "http://search-promed-en-fxxmsfyg24tcbr2vohkeahm3f4.us-east-1.cloudsearch.amazonaws.com/2013-01-01/search?q="+str(keyword)+"&q.options={fields:%20[%27title%27]}&return=archive_id,date,title&sort=date%20desc,archive_id%20desc&size="+str(number_of_articles)
        
        req = Request(page_url, headers={'User-Agent': 'Mozilla/5.0'})
        uClient = urlopen(req)

        my_html = uClient.read().decode('utf-8')

        page_json =json.loads(my_html) 
        uClient.close()

        response_json={}
        articles=[]

        for entry in page_json["hits"]["hit"]:
            archive_id = str(entry["id"])
            page_url = "https://promedmail.org/promed-post/?id="+archive_id+"&view=true"
            print(page_url)

            req = Request(page_url, headers={'User-Agent': 'Mozilla/5.0'})
            uClient = urlopen(req)

            my_html = uClient.read().decode('utf-8')

            page_soup = soup(my_html, "html.parser")
            uClient.close()

            publish_date_paragraph = page_soup.findAll("p", {"class": "publish_date_html"})
            with open('data.txt', 'w') as outfile:
                outfile.write(str(page_soup))
                outfile.close()


            publish_date_spans= publish_date_paragraph[0].findAll("span", {"class": "blue"})
            main_text_html = page_soup.findAll("div", {"class": "text1"})[0]

            data = {
                "url": str(page_url),
                "archive_id": str(entry["id"]),
                "date": str(publish_date_spans[0].text).strip(),
                "headline": str(entry["fields"]["title"]).strip(),
                "main_text": str(main_text_html.text),
                "reports": []
            }
            articles.append(data)
        response_json["articles"] = articles
        return response_json
            
    else:
        response_json = {"error": "no articles found"}
        return response_json


if __name__ == "__main__":
    json = search_by_keyword("covid")
    # with open('data.txt', 'w') as outfile:
    #     json.dump(data, outfile)



