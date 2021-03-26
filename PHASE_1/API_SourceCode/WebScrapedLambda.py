'''
On Lambda. Updates the database!
'''

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import os
from selenium.webdriver.common.by import By
from urllib.request import urlopen
from urllib.request import Request
import urllib.parse
import json
import re
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import boto3

client = boto3.client('lambda')

all_keywords = ["unknown",
    "other",
    "anthrax cutaneous",
    "anthrax gastrointestinous",
    "anthrax inhalation",
    "botulism",
    "brucellosis",
    "chikungunya",
    "cholera",
    "cryptococcosis",
    "cryptosporidiosis",
    "crimean-congo haemorrhagic fever",
    "dengue",
    "diphteria",
    "ebola haemorrhagic fever",
    "ehec (e.coli)",
    "enterovirus 71 infection",
    "influenza a/h5n1",
    "influenza a/h7n9",
    "influenza a/h9n2",
    "influenza a/h1n1",
    "influenza a/h1n2",
    "influenza a/h3n5",
    "influenza a/h3n2",
    "influenza a/h2n2",
    "hand, foot and mouth disease",
    "hantavirus",
    "hepatitis a",
    "hepatitis b",
    "hepatitis c",
    "hepatitis d",
    "hepatitis e",
    "histoplasmosis",
    "hiv/aids",
    "lassa fever",
    "malaria",
    "marburg virus disease",
    "measles",
    "mers-cov",
    "mumps",
    "nipah virus",
    "norovirus infection",
    "pertussis",
    "plague",
    "pneumococcus pneumonia",
    "poliomyelitis",
    "q fever",
    "rabies",
    "rift valley fever",
    "rotavirus infection",
    "rubella",
    "salmonellosis",
    "sars",
    "shigellosis",
    "smallpox",
    "staphylococcal enterotoxin b",
    "thypoid fever",
    "tuberculosis",
    "tularemia",
    "vaccinia and cowpox",
    "varicella",
    "west nile virus",
    "yellow fever",
    "yersiniosis",
    "zika",
    "legionares",
    "listeriosis",
    "monkeypox",
    "COVID-19",
    "Haemorrhagic Fever",
    "Acute Flacid Paralysis",
    "Acute gastroenteritis",
    "Acute respiratory syndrome",
    "Influenza-like illness",
    "Acute fever and rash",
    "Fever of unknown Origin",
    "Encephalitis",
    "Meningitis"]


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

    driver = webdriver.Chrome(options=chrome_options)

    #for free keyword (note only ONE keyword)
    if 'keyword' in event.keys():
        print("LOG: Finding articles for the following keyword: " + str(event['keyword']))
        number_of_articles_to_scrape = 20
        url_encoded_keyword= urllib.parse.quote(str(event['keyword'])).replace("/", "%2F")
        
        # max 20 articles
        if 'number_of_articles_to_scrape' in event.keys() and event['number_of_articles_to_scrape'] > 0 and event['number_of_articles_to_scrape'] < 20:
            number_of_articles_to_scrape = event['number_of_articles_to_scrape']
        
        # pagination
        start_index=0
        if 'start_index' in event.keys() and event['start_index'] > 0:
            start_index = event['start_index']

        page_url = ""
        if 'start_date' in event.keys() and 'end_date' in event.keys():
            start = event["start_date"]
            end = event["end_date"]
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
            print("LOG: Articles found within the given spec: ")
            articles = []
            num = 0
            #check if the id is in the database already
            for entry in page_json["hits"]["hit"]:
                if num >= start_index:
                    archive_id = str(entry["id"])
                    # create the data for this particular article and add it to the articles array
                    page_url = "https://promedmail.org/promed-post/?id="+archive_id
                    
                    driver.get(page_url)
                    print("    "+page_url)
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
            response_json[str(event['keyword'])] = articles
        else:
            # response_json[str(event['keyword'])] = "no articles found with your specifications!"
            response_json[str(event['keyword'])] = []
            print("LOG: no articles found with your specifications!")
    else:
        inputForNumArticles={
            "check_num": {}
        }
        for keyword in all_keywords:
            print("LOG: UPDATING ALL KEYWORDS onto Database!")
            print("LOG: Finding articles for the following keyword: " + keyword)
            url_encoded_keyword= urllib.parse.quote(str(keyword)).replace("/", "%2F")
            # URl to web scrap from. Originally do the smallest size in order to get the total number of articles
            page_url="http://search-promed-en-fxxmsfyg24tcbr2vohkeahm3f4.us-east-1.cloudsearch.amazonaws.com/2013-01-01/search?q="+str(url_encoded_keyword)+"&q.options={fields:%20[%27title%27]}&return=archive_id,date,title&sort=date%20desc,archive_id%20desc"

            req = Request(page_url, headers={'User-Agent': 'Mozilla/5.0'})

            # opens the connection and downloads html page from url
            uClient = urlopen(req)

            my_html = uClient.read().decode('utf-8')

            articles_response_json =json.loads(my_html) 
            uClient.close()

            #how many articles were found
            number_of_articles_in_promed = articles_response_json["hits"]["found"]
            print("LOG: Articles on promed about " + keyword + " = " + str(number_of_articles_in_promed))
            if number_of_articles_in_promed > 0:
                # open connection again but this time to get ALL the articles
                page_url=page_url+"&size="+str(number_of_articles_in_promed)

                req = Request(page_url, headers={'User-Agent': 'Mozilla/5.0'})

                # opens the connection and downloads html page from url
                uClient = urlopen(req)

                my_html = uClient.read().decode('utf-8')

                articles_response_json =json.loads(my_html) 
                uClient.close()

                inputForNumArticles["check_num"][keyword] = [entry["id"] for entry in articles_response_json["hits"]["hit"]]
            elif number_of_articles_in_promed == 0:
                print(str(keyword)+": no articles!")
            else:
                # response_json[str(keyword)] = "negative articles!"
                print(str(keyword)+": negative articles!")
        print("LOG: Comparing article IDs to the Database to check which articles are on the database already")
        responseForNumArticles = client.invoke(
            FunctionName='arn:aws:lambda:ap-southeast-2:733638017875:function:uploadToDatabase',
            InvocationType='RequestResponse',
            Payload=json.dumps(inputForNumArticles)
        )
        responseForNumArticlesJson = json.load(responseForNumArticles['Payload'])
        print("LOG: Article Ids not on Database =")
        print(responseForNumArticlesJson)
        print()
        for keyword in responseForNumArticlesJson.keys():
            articles = []
            for entry in responseForNumArticlesJson[keyword]:
                archive_id = str(entry)
                # create the data for this particular article and add it to the articles array
                page_url = "https://promedmail.org/promed-post/?id="+archive_id
                print("LOG: Scraping: " + page_url)
                driver.get(page_url)
                try:
                    # get the date  
                    publish_date_paragraph = WebDriverWait(driver, 30).until(EC.presence_of_element_located((By.CLASS_NAME, "publish_date_html")))
                    # using regex to extract the date
                    date_match = re.search(r"^Published Date: (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})", publish_date_paragraph.text)

                    heading_match = re.search(r"Subject: (.*)\nArchive Number:", publish_date_paragraph.text)

                    # get the main text
                    main_text = WebDriverWait(driver, 30).until(EC.presence_of_element_located((By.CLASS_NAME, "text1")))
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
                        "headline": str(heading_match.groups()[0]).strip(),
                        "url": page_url,
                        "date": str(date_match.groups()[0]).strip(),
                        "main_text": main_text_formated,
                        "summary": reports_response_json['summary'],
                        "reports": reports_response_json['report']
                    }
                    articles.append(data)
                except TimeoutException:
                    print("LOG: Timeout Exception while scraping: " + page_url + " article skipped")
                    pass
            response_json[keyword] = articles
        
        print("LOG: Adding new articles to Database")
        inputForDB={
            'report': response_json
        }
        responseForDB = client.invoke(
            FunctionName='arn:aws:lambda:ap-southeast-2:733638017875:function:uploadToDatabase',
            InvocationType='Event',
            Payload=json.dumps(inputForDB)
        )
    print("LOG: Function Exiting")
    driver.close()        
    return response_json
