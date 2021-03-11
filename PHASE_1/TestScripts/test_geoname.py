import requests
import sys

r = requests.get("http://api.geonames.org/searchJSON?formatted=true&q=%s&maxRows=1&lang=es&username=byteme&style=full" % (sys.argv[1]))

id = r.json()["geonames"][0]["geonameId"]

r = requests.get("http://api.geonames.org/hierarchyJSON?formatted=true&geonameId=%d&username=byteme&style=full" % (id))

json_result = r.json()

results = json_result["geonames"]

for r in results:
	location = "%s (%s)" % (r["asciiName"], r["geonameId"])
	print(location)
