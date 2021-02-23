import bs4
from bs4 import BeautifulSoup as soup  # HTML data structure
from urllib.request import urlopen # Web client
from urllib.request import Request

# URl to web scrap from.
page_url = "https://promedmail.org/coronavirus/"

req = Request(page_url, headers={'User-Agent': 'Mozilla/5.0'})

# opens the connection and downloads html page from url
uClient = urlopen(req)

my_html = uClient.read().decode('utf-8')

# parses html into a soup data structure to traverse html
# as if it were a json data type.
page_soup = soup(my_html, "html.parser")
uClient.close()

covid_lists = page_soup.findAll("div", {"class": "corona-virus-list"})

# finds each product from the store page
# old_containers = page_soup.findAll("a", {"class": "lcl"})

# name the output file to write to local disk
out_filename = "covid_cases.csv"
# header of csv file to be written
headers = "date, title \n"

# opens file, and writes headers
f = open(out_filename, "w")
f.write(headers)

for covid_list in covid_lists:
    containers = covid_list.ul.findAll("li")
    # loops over each product and grabs attributes about
    # each product
    for container in containers:
        all_text = container.text

        title = container.a.text.strip()

        date = all_text.replace(title, '').strip()


        # writes the dataset to file
        f.write(date + ", " + title.replace(",", "|") + "\n")

f.close()  # Close the file
