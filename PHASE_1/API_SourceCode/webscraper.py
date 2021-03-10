from urllib.request import urlopen
from urllib.request import Request
import json
import re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def search_by_keyword (keyword):
    # URl to web scrap from. Originally do the smallest size in order to get the total number of articles
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
        # open connection again but this time to get ALL the articles
        page_url= "http://search-promed-en-fxxmsfyg24tcbr2vohkeahm3f4.us-east-1.cloudsearch.amazonaws.com/2013-01-01/search?q="+str(keyword)+"&q.options={fields:%20[%27title%27]}&return=archive_id,date,title&sort=date%20desc,archive_id%20desc&size="+str(number_of_articles)
        
        req = Request(page_url, headers={'User-Agent': 'Mozilla/5.0'})
        uClient = urlopen(req)

        my_html = uClient.read().decode('utf-8')

        page_json =json.loads(my_html) 
        uClient.close()

        response_json={}
        articles=[]

        # open selenium this time so that javascript can load on the individual pages (headless option 
        # so it doesn't actually open the browser)
        options = webdriver.ChromeOptions()
        options.add_argument("headless")

        driver = webdriver.Chrome(options = options)
        
        # The next line says: wait 10 seconds everytime you search the dom
        driver.implicitly_wait(10)

        for entry in page_json["hits"]["hit"]:
            archive_id = str(entry["id"])
            page_url = "https://promedmail.org/promed-post/?id="+archive_id
            
            # connect to the url
            driver.get(page_url)

            # get the date 
            print(page_url)
            publish_date_paragraph = WebDriverWait(driver, 30).until(EC.presence_of_element_located((By.CLASS_NAME, "publish_date_html")))
            # publish_date_paragraph = driver.find_element_by_xpath('//p[@class="publish_date_html"]')
            # using regex to extract the date
            date_pattern = re.compile(r'^Published Date: (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})')
            date_match = date_pattern.search(publish_date_paragraph.text)

            # get the main text
            main_text = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "text1")))
            # main_text = driver.find_element_by_class_name('text1')

            # create tge data for this particular article and add it to the articles array
            data = {
                "url": str(page_url),
                "archive_id": str(entry["id"]),
                "date": str(date_match.groups()[0]).strip(),
                "headline": str(entry["fields"]["title"]).strip(),
                "main_text": str(main_text.text),
                "reports": []
            }
            articles.append(data)
        
        # close selenium webdriver
        driver.quit()

        # put the response into the response_json array
        response_json["articles"] = articles
        return response_json
            
    else:
        # there were no responses to return
        response_json = {"error": "no articles found"}
        return response_json


if __name__ == "__main__":
    # search a particular keyword --> will change this to be a array of keywords
    data = search_by_keyword("hiv")
    
    # write to a file --> need to change to write to the database
    with open('data.txt', 'w') as outfile:
        json.dump(data, outfile)

