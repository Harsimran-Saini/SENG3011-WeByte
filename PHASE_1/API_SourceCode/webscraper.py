from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from urllib.request import urlopen
from urllib.request import Request
import urllib.parse
import json
import re
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from reports import reports
from concurrent.futures import ProcessPoolExecutor, as_completed

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
    "lassa fever"]

todo_keywords =     ["malaria",
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

#set up driver
def getDriver():
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    #chrome_options.add_argument('--no-sandbox')
    #chrome_options.add_argument('--disable-gpu')
    # chrome_options.add_argument('--window-size=1280x1696')
    # chrome_options.add_argument('--user-data-dir=/tmp/user-data')
    # chrome_options.add_argument('--hide-scrollbars')
    chrome_options.add_argument('--disable-logging')
    chrome_options.add_argument('--silent')
    chrome_options.add_argument('--log-level=3') # Quieter logging
    #chrome_options.add_argument('--v=99')
    #chrome_options.add_argument('--single-process')
    # chrome_options.add_argument('--data-path=/tmp/data-path')
    #chrome_options.add_argument('--ignore-certificate-errors')
    # chrome_options.add_argument('--homedir=/tmp')
    # chrome_options.add_argument('--disk-cache-dir=/tmp/cache-dir')
    chrome_options.add_argument('User-Agent=Mozilla/5.0')
    chrome_options.add_experimental_option('excludeSwitches', ['enable-logging'])

    return webdriver.Chrome(options=chrome_options)

def search_by_keyword (keyword, start=None, end=None):
    
    response_json = {}
    url_encoded_keyword= urllib.parse.quote(str(keyword)).replace("/", "%2F")
    # URl to web scrap from. Originally do the smallest size in order to get the total number of articles
    if start != None and end != None:
        page_url="http://search-promed-en-fxxmsfyg24tcbr2vohkeahm3f4.us-east-1.cloudsearch.amazonaws.com/2013-01-01/search?q.parser=structured&q=(and%20date:["+str(start)+","+str(end)+"]%20%27"+str(url_encoded_keyword)+"%27)&q.options={fields:%20[%27title%27]}&return=archive_id,date,title&sort=date%20desc,archive_id%20desc"
    else:
        page_url="http://search-promed-en-fxxmsfyg24tcbr2vohkeahm3f4.us-east-1.cloudsearch.amazonaws.com/2013-01-01/search?q="+str(url_encoded_keyword)+"&q.options={fields:%20[%27title%27]}&return=archive_id,date,title&sort=date%20desc,archive_id%20desc"

    req = Request(page_url, headers={'User-Agent': 'Mozilla/5.0'})

    # opens the connection and downloads html page from url
    uClient = urlopen(req)

    my_html = uClient.read().decode('utf-8')

    articles_response_json =json.loads(my_html) 
    uClient.close()

    #how many articles were found
    number_of_articles_in_promed = articles_response_json["hits"]["found"]

    articles = []
    if number_of_articles_in_promed > 0:
        # open connection again but this time to get ALL the articles
        page_url= page_url+"&size="+str(number_of_articles_in_promed)

        req = Request(page_url, headers={'User-Agent': 'Mozilla/5.0'})
        uClient = urlopen(req)

        my_html = uClient.read().decode('utf-8')

        page_json = json.loads(my_html) 
        uClient.close()

        # Scrape each article
        print(f"Keyword: {keyword} has {len(page_json['hits']['hit'])} articles.")
        entries = page_json["hits"]["hit"]
        with ProcessPoolExecutor(max_workers=10) as executor:
            start = time.time()
            futures = [ executor.submit(scrapeArticle, entry) for entry in entries ]
            articles = []
            try:
                for result in as_completed(futures, timeout=120 + (len(entries) * 5)):
                    try:
                        if result.result() != None:
                            articles.append(result.result())
                        else:
                            print("Error: failed to scrape")
                    except Exception as e:
                        print(e)
                        with open('failedIDs.txt', 'a') as outfile:
                            outfile.write("failed with unknown ID" + "\n")
            except Exception as e:
                print(e)
                with open('failedIDs.txt', 'a') as outfile:
                    outfile.write(f"{keyword} failed with unknown ID" + "\n")

            end = time.time()
            print(f"{keyword} scraped {len(articles)} articles in {end-start}s")

        response_json[str(keyword)] = articles
    else:
        print(f"No articles for keyword {keyword}")

    response_json[str(keyword)+"_num_of_articles"] = str(number_of_articles_in_promed)
        
    return response_json

def scrapeArticle(entry):
    driver = getDriver()
    archive_id = str(entry["id"])
    # create the data for this particular article and add it to the articles array
    page_url = "https://promedmail.org/promed-post/?id="+archive_id
    
    print("GET: " + page_url)
    try:
        driver.get(page_url)
        # get the date
        publish_date_paragraph = WebDriverWait(driver, 90).until(EC.presence_of_element_located((By.CLASS_NAME, "publish_date_html")))
        # using regex to extract the date
        date_match = re.search(r"^Published Date: (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})", publish_date_paragraph.text)

        # get the main text
        main_text = WebDriverWait(driver, 90).until(EC.presence_of_element_located((By.CLASS_NAME, "text1"))).text
        see_Also = re.search(r"\nSee Also\n(.*\n.*)*", main_text)
    
        if see_Also != None:
            main_text = main_text.replace(see_Also[0], "")
        
        main_text_formated = str(main_text).replace("\"", "\'")
        
        reports_response = reports(main_text_formated)
        
        data = {
            "archive_id": archive_id,
            "headline": str(entry["fields"]["title"]).strip(),
            "url": page_url,
            "date": str(date_match.groups()[0]).strip(),
            "main_text": main_text_formated,
            "summary": reports_response['summary'],
            "reports": reports_response['report']
        }
    except Exception as e:
        print(e)
        with open('failed.txt', 'a') as outfile:
            outfile.write(json.dumps({
                "id": archive_id,
                "error": str(e)
            }))
            outfile.write("\n")
        with open('failedIDs.txt', 'a') as outfile:
            outfile.write(archive_id + "\n")
        
        # Make sure we're not leaving open any drivers
        try:
            driver.close()
            driver.quit()
        except Exception as e:
            pass
        return None
    
    driver.close()
    driver.quit()
    return data


if __name__ == "__main__":
    try:
        with open("txtfiles/malaria.txt", "a") as f:
            pass
    except Exception as e:
        print(e)
        exit(1)
    for key in todo_keywords:
        name = key.replace("/", " ").replace("("," ").replace(")", " ").replace(".", " ").replace(",", " ").replace(" ", "+")
        name = "txtfiles/"+name+".txt"
        print(name)
        my_response_json = search_by_keyword(key)
        # write to a file --> need to change to write to the database
        with open(name, 'w+') as outfile:
            json.dump(my_response_json, outfile)
            outfile.close()