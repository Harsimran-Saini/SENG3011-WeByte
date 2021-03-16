import json
import sys
from decimal import Decimal
from boto3.dynamodb.types import TypeSerializer

if __name__ == '__main__':

    disease_name = sys.argv[1]
    serializer = TypeSerializer()

    with open("../API_SourceCode/data.txt") as json_file:
      disease_list = json.load(json_file, parse_float=Decimal)
      for articles in disease_list['other']:
          articles['disease'] = f'{disease_name}'
          articles['archive_id'] = int(articles['archive_id'])

    with open("../API_SourceCode/data.txt", 'w') as json_file:
      json.dump(disease_list, json_file)
      print(disease_list['other'])
