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
            page_url = "https://promedmail.org/promed-post/?id="+archive_id
            print(page_url)

            # session = HTMLSession()
            payload = {
                'action': 'get_latest_post_data',
                'alertId': '8233369'
            }
            r= requests.post(
                url= page_url,
                data= payload,
                headers={
                    'authority': 'promedmail.org',
                    'method': 'POST',
                    'path': '/wp-admin/admin-ajax.php',
                    'scheme': 'https',
                    'accept': 'application/json, text/javascript, */*; q=0.01',
                    'accept-encoding': 'gzip, deflate, br',
                    'accept-language': 'en-US,en;q=0.9',
                    'content-length': '43',
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'cookie': '__cfduid=dfde8dc5016e34bd63b016ad2faaf7a661614048489; CookieConsent={stamp:%2706sQZaFDQYAIZonajvnUr2/x4mRVOfZJjbp5TuudEfjiajJdb39pSQ==%27%2Cnecessary:true%2Cpreferences:true%2Cstatistics:true%2Cmarketing:true%2Cver:1%2Cutc:1614048506931%2Cregion:%27au%27}; _ga=GA1.2.671505569.1614048507; _gid=GA1.2.654140325.1615186199; __atuvc=32%7C8%2C13%7C9%2C38%7C10; __atuvs=6046cf056ec1435f002; _gat_gtag_UA_149252964_1=1',
                    'origin': 'https://promedmail.org',
                    'referer': 'https://promedmail.org/promed-post/?id=8233369',
                    'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin',
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36',
                    'x-requested-with': 'XMLHttpRequest'
                }
            )

            r = requests.post(
                url=page_url,
                data=payload,
                headers={
                    'User-Agent': 'Mozilla/5.0', 
                    'referer': page_url+"&view=true",
                    'x-requested-with': 'XMLHttpRequest'
                }
            )   
            # session.headers.update({'User-Agent': 'Mozilla/5.0', 'referer': 'https://promedmail.org/promed-posts/'})

            # opens the connection and downloads html page from url
            # uClient = session.get(page_url)

            # uClient.html.render()

            # my_html = uClient.read().decode('utf-8')

            # page_soup = soup(uClient.html.html, "html.parser")
            # uClient.close()

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

