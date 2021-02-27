import bs4
import requests
from bs4 import BeautifulSoup as soup  # HTML data structure
from urllib.request import urlopen # Web client
from urllib.request import Request
from urllib.parse import urlencode

# URl to web scrap from.
page_url = "https://promedmail.org/promed-posts/"

# headers = {
#     "authority": 'promedmail.org',
#     "method": 'POST',
#     "path": '/wp-admin/admin-ajax.php',
#     "scheme": 'https',
#     "accept": 'application/json, text/javascript, */*; q=0.01',
#     "accept-encoding": 'gzip, deflate, br',
#     "accept-language": 'en-US,en;q=0.9',
#     "content-length": '318',
#     "content-type": 'application/x-www-form-urlencoded; charset=UTF-8',
#     "cookie": '__cfduid=dfde8dc5016e34bd63b016ad2faaf7a661614048489; CookieConsent={stamp:%2706sQZaFDQYAIZonajvnUr2/x4mRVOfZJjbp5TuudEfjiajJdb39pSQ==%27%2Cnecessary:true%2Cpreferences:true%2Cstatistics:true%2Cmarketing:true%2Cver:1%2Cutc:1614048506931%2Cregion:%27au%27}; _ga=GA1.2.671505569.1614048507; _gid=GA1.2.503610977.1614393331; _gat_gtag_UA_149252964_1=1; __atuvc=29%7C8; __atuvs=6039aff236c3c635001',
#     "origin": 'https://promedmail.org',
#     "referer": 'https://promedmail.org/promed-posts/',
#     "sec-ch-ua": '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
#     "sec-fetch-dest": 'empty',
#     "sec-fetch-mode": 'cors',
#     "sec-fetch-site": 'same-origin',
#     "user-agent": 'Mozilla/5.0',
#     "x-requested-with": 'XMLHttpRequest'
# }

data = urlencode({
    "action": "get_promed_search_content",
    "query[0][name]": "kwby1",
    "query[0][value]": "summary",
    "query[1][name]": "search",
    "query[1][value]": "covid",
    "query[2][name]": "date1",
    "query[2][value]": "",
    "query[3][name]": "date2",
    "query[3][value]": "",
    "query[4][name]": "feed_id",
    "query[4][value]": "1"
})
data = data.encode('ascii')

req = requests.post(page_url, data=data)

# opens the connection and downloads html page from url
uClient = urlopen(req)

my_html = uClient.read().decode('utf-8')

# parses html into a soup data structure to traverse html
# as if it were a json data type.
page_soup = soup(my_html, "html.parser")
uClient.close()
