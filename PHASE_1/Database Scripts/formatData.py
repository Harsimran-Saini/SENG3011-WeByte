import json
import sys
from decimal import Decimal
from boto3.dynamodb.types import TypeSerializer

if __name__ == '__main__':

    disease_name = sys.argv[1]
    serializer = TypeSerializer()

    with open("data.json") as json_file:
      disease_list = json.load(json_file, parse_float=Decimal)
      for articles in disease_list['other']:
          articles['disease'] = f'{disease_name}'
          articles['archive_id'] = int(articles['archive_id'])
          articles['info'] = {
                                  "url": f"{articles['url']}",
                                  "date": f"{articles['date']}",
                                  "headline": f"{articles['headline']}",
                                  "main_text":f"{articles['main_text']}",
                                  "reports" : f"{articles['reports']}"
                              }
          articles.pop('url')
          articles.pop('date')
          articles.pop('headline')
          articles.pop('main_text')
          articles.pop('reports')

    with open("data.json", 'w') as json_file:
      json.dump(disease_list, json_file)
      print(disease_list['other'])
