from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import os
from selenium.webdriver.common.by import By
from urllib.request import urlopen
from urllib.request import Request
import urllib.parse
import json
import re
import json
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import boto3

client = boto3.client('lambda')

def lambda_handler(event, context):
    response_json = {}
    #set up driver
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--window-size=1280x1696')
    chrome_options.add_argument('--user-data-dir=/tmp/user-data')
    chrome_options.add_argument('--hide-scrollbars')
    chrome_options.add_argument('--enable-logging')
    chrome_options.add_argument('--log-level=0')
    chrome_options.add_argument('--v=99')
    chrome_options.add_argument('--single-process')
    chrome_options.add_argument('--data-path=/tmp/data-path')
    chrome_options.add_argument('--ignore-certificate-errors')
    chrome_options.add_argument('--homedir=/tmp')
    chrome_options.add_argument('--disk-cache-dir=/tmp/cache-dir')
    chrome_options.add_argument('user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36')
    chrome_options.binary_location = os.getcwd() + "/bin/headless-chromium"


    if (event['queryStringParameters'] == None):
        resObject = {}
        resObject['statusCode'] = 400
        resObject['headers'] = {}
        resObject['headers']['Content-Type'] = 'application/json'
        resObject['body'] = json.dumps({"Error": "Please enter a keyword"}, indent=2)
        return resObject 

    #for free keyword (note only ONE keyword)
    if 'keyword' not in event['queryStringParameters'].keys():
        resObject = {}
        resObject['statusCode'] = 400
        resObject['headers'] = {}
        resObject['headers']['Content-Type'] = 'application/json'
        resObject['body'] = json.dumps({"Error": "Please enter a keyword"}, indent=2)
        return resObject 
    else:
        driver = webdriver.Chrome(options=chrome_options)
        number_of_articles_to_scrape = 20
        url_encoded_keyword= event['queryStringParameters']['keyword']
        
        # max 20 articles
        if 'number_of_articles_to_scrape' in event.keys() and event['queryStringParameters']['number_of_articles_to_scrape'] > 0 and event['queryStringParameters']['number_of_articles_to_scrape'] < 20:
            number_of_articles_to_scrape = event['queryStringParameters']['number_of_articles_to_scrape']
        
        # pagination
        start_index=0
        if 'start_index' in event.keys() and event['queryStringParameters']['start_index'] > 0:
            start_index = event['start_index']

        page_url = ""
        if 'start_date' in event.keys() and 'end_date' in event.keys():
            start = event['queryStringParameters']["start_date"]
            end = event['queryStringParameters']["end_date"]
            page_url="http://search-promed-en-fxxmsfyg24tcbr2vohkeahm3f4.us-east-1.cloudsearch.amazonaws.com/2013-01-01/search?q.parser=structured&q=(and%20date:["+str(start)+","+str(end)+"]%20%27"+str(url_encoded_keyword)+"%27)&q.options={fields:%20[%27title%27]}&return=archive_id,date,title&sort=date%20desc,archive_id%20desc&size="+str(number_of_articles_to_scrape + start_index)
        else:
            page_url="http://search-promed-en-fxxmsfyg24tcbr2vohkeahm3f4.us-east-1.cloudsearch.amazonaws.com/2013-01-01/search?q="+str(url_encoded_keyword)+"&q.options={fields:%20[%27title%27]}&return=archive_id,date,title&sort=date%20desc,archive_id%20desc&size="+str(number_of_articles_to_scrape + start_index)

        req = Request(page_url, headers={'User-Agent': 'Mozilla/5.0'})
        uClient = urlopen(req)

        my_html = uClient.read().decode('utf-8')

        page_json =json.loads(my_html) 
        uClient.close()

        #how many articles were found
        number_of_articles_in_promed = page_json["hits"]["found"]

        if number_of_articles_in_promed > start_index:
            articles = []
            num = 0
            #check if the id is in the database already
            for entry in page_json["hits"]["hit"]:
                if num >= start_index:
                    archive_id = str(entry["id"])
                    # create the data for this particular article and add it to the articles array
                    page_url = "https://promedmail.org/promed-post/?id="+archive_id
                    
                    driver.get(page_url)
                    print(page_url)
                    # get the date
                    publish_date_paragraph = WebDriverWait(driver, 90).until(EC.presence_of_element_located((By.CLASS_NAME, "publish_date_html")))
                    # using regex to extract the date
                    date_match = re.search(r"^Published Date: (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})", publish_date_paragraph.text)

                    # get the main text
                    main_text = WebDriverWait(driver, 90).until(EC.presence_of_element_located((By.CLASS_NAME, "text1")))
                    # main_text = driver.find_element_by_class_name('text1')
                    
                    main_text = main_text.text

                    see_Also = re.search(r"\nSee Also\n(.*\n.*)*", main_text)

                    if see_Also != None:
                        main_text = main_text.replace(see_Also[0], "")

                    main_text_formated = str(main_text).replace("\"", "\'")

                    inputForReports = {'main_text': main_text_formated}

                    reports_response = client.invoke(
                        FunctionName='arn:aws:lambda:ap-southeast-2:733638017875:function:testing_layers',
                        InvocationType='RequestResponse',
                        Payload=json.dumps(inputForReports)
                    )

                    reports_response_json = json.load(reports_response['Payload'])

                    data = {
                        "archive_id": archive_id,
                        "headline": str(entry["fields"]["title"]).strip(),
                        "url": page_url,
                        "date": str(date_match.groups()[0]).strip(),
                        "main_text": main_text_formated,
                        "summary": reports_response_json['summary'],
                        "reports": reports_response_json['report']
                    }
                    articles.append(data)
                else:
                    num = num +1
            response_json[event['queryStringParameters']['keyword']] = articles
            driver.close()  
        else:
            # response_json[str(event['keyword'])] = "no articles found with your specifications!"
            response_json[event['queryStringParameters']['keyword']] = []
            #print(str(event['keyword'])+": no articles found with your specifications!")        

    resObject = {}
    resObject['statusCode'] = 200
    resObject['headers'] = {}
    resObject['headers']['Content-Type'] = 'application/json'
    resObject['body'] = json.dumps(response_json)
    return resObject       
