from decimal import Decimal
import json
import boto3
import sys

def load_disease(diseases, dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb', endpoint_url="https://dynamodb.ap-southeast-2.amazonaws.com")

    table = dynamodb.Table('Data')

    for d in diseases:
        id = d['archive_id']
        disease = d['disease']
        print("Adding disease:", id, disease)
        table.put_item(Item=d)


if __name__ == '__main__':
    disease_name = sys.argv[1]
    with open("../API_SourceCode/data.txt", 'r') as json_file:
        disease_list = json.load(json_file, parse_float=Decimal)

        print(disease_list.keys())
        load_disease(disease_list[disease_name])
