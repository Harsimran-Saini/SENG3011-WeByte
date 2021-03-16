from urllib.request import urlopen
from urllib.request import Request
import urllib.parse
import json
import re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from reports import reports
import boto3
from boto3.dynamodb.conditions import Key
from boto3.dynamodb.conditions import Attr
import concurrent.futures

articles = []

all_keywords = [
    "unknown",
    "other",
    "anthrax cutaneous",
    "anthrax gastrointestinous",
    "anthrax inhalation" ,
    "botulism",
    "brucellosis",
    "chikungunya",
    "cholera",
    "cryptococcosis",
    "cryptosporidiosis",
    "crimean-congo haemorrhagic fever",
    "dengue",
    "diphteria",
    ##########################################
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
    "Meningitis"
]

options = webdriver.ChromeOptions()
options.add_argument("headless")

driver = webdriver.Chrome(options = options)

def search_by_keyword (keywords=[], start=None, end=None):
    response_json={}
    # open selenium so that javascript can load on the individual pages (headless option 
    # so it doesn't actually open the browser)

    for keyword in keywords:
        url_encoded_keyword= urllib.parse.quote(str(keyword)).replace("/", "%2F")
        # URl to web scrap from. Originally do the smallest size in order to get the total number of articles
        if start == None or end == None:
            page_url="http://search-promed-en-fxxmsfyg24tcbr2vohkeahm3f4.us-east-1.cloudsearch.amazonaws.com/2013-01-01/search?q="+str(url_encoded_keyword)+"&q.options={fields:%20[%27title%27]}&return=archive_id,date,title&sort=date%20desc,archive_id%20desc"
        else:
            page_url="http://search-promed-en-fxxmsfyg24tcbr2vohkeahm3f4.us-east-1.cloudsearch.amazonaws.com/2013-01-01/search?q.parser=structured&q=(and%20date:["+str(start)+","+str(end)+"]%20%27"+str(url_encoded_keyword)+"%27)&q.options={fields:%20[%27title%27]}&return=archive_id,date,title&sort=date%20desc,archive_id%20desc"
        
        req = Request(page_url, headers={'User-Agent': 'Mozilla/5.0'})

        # opens the connection and downloads html page from url
        uClient = urlopen(req)

        my_html = uClient.read().decode('utf-8')

        page_json =json.loads(my_html) 
        uClient.close()
        
        #database
        # client = boto3.resource('dynamodb')
        # table = client.Table("Keyword-frequencies")
        # response= table.query(KeyConditionExpression= Key('Keyword').eq(keyword.lower()))
        # number_of_articles_database = response['Items'][0]['Number_of_articles']

        #how many articles were found
        number_of_articles = page_json["hits"]["found"]
        articles = []
        response_json[str(keyword)+"num_articles"] = str(number_of_articles)
        # number_of_articles = number_of_articles_site - number_of_articles_database

        if number_of_articles != 0:
            # open connection again but this time to get ALL the articles
            page_url= page_url+"&size="+str(number_of_articles)
            
            req = Request(page_url, headers={'User-Agent': 'Mozilla/5.0'})
            uClient = urlopen(req)

            my_html = uClient.read().decode('utf-8')

            page_json =json.loads(my_html) 
            uClient.close()

            for entry in page_json["hits"]["hit"]:
                archive_id = str(entry["id"])
                # create the data for this particular article and add it to the articles array
                data = {
                    "archive_id": archive_id,
                    "headline": str(entry["fields"]["title"]).strip(),
                }
                articles.append(data)
            
            with concurrent.futures.ThreadPoolExecutor() as executor:
                executor.map(queryArticles, articles)
            # put the response into the response_json array
            response_json[str(keyword)] = articles
            
        
    # close selenium webdriver
    driver.quit()

    return response_json

def queryArticles(article): 
    
    page_url = "https://promedmail.org/promed-post/?id="+article["archive_id"]
    driver.get(page_url)
    print(page_url)
    # get the date
    publish_date_paragraph = WebDriverWait(driver, 30).until(EC.presence_of_element_located((By.CLASS_NAME, "publish_date_html")))
    # using regex to extract the date
    date_pattern = re.compile(r'^Published Date: (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})')
    date_match = date_pattern.search(publish_date_paragraph.text)

    # get the main text
    main_text = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "text1")))
    # main_text = driver.find_element_by_class_name('text1')

    article["url"] = page_url
    article["date"] = str(date_match.groups()[0]).strip()
    article["main_text"] = str(main_text.text)
    article["reports"] = reports(str(main_text.text))
        
    for article in articles:
        page_url = "https://promedmail.org/promed-post/?id="+article["archive_id"]
        driver.get(page_url)
        print(page_url)
        # get the date
        publish_date_paragraph = WebDriverWait(driver, 30).until(EC.presence_of_element_located((By.CLASS_NAME, "publish_date_html")))
        # using regex to extract the date
        date_pattern = re.compile(r'^Published Date: (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})')
        date_match = date_pattern.search(publish_date_paragraph.text)

        # get the main text
        main_text = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "text1")))
        # main_text = driver.find_element_by_class_name('text1')

        article["url"] = page_url
        article["date"] = str(date_match.groups()[0]).strip()
        article["main_text"] = str(main_text.text).replace("\"", "\'")
        article["reports"] = reports(str(main_text.text))
        

    # put the response into the response_json array
    #articles.append(article)
    #response_json["latest"] = article

if __name__ == "__main__":
    
    for key in all_keywords:
        name = key.replace("/", " ").replace("("," ").replace(")", " ").replace(".", " ").replace(",", " ").replace(" ", "+")
        name = "txtfiles/"+name+".txt"
        print(name)
        my_response_json = {}
        my_response_json = search_by_keyword([key])
        # write to a file --> need to change to write to the database
        with open(name, 'w') as outfile:
            json.dump(my_response_json, outfile)
            outfile.close()

