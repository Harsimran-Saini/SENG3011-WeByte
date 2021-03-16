import json
import sys
from decimal import Decimal
import boto3
def delete_disease_table(dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb', endpoint_url="http://localhost:8000")

    table = dynamodb.Table('Diseases')
    table.delete

if __name__ == '__main__':
    delete_disease_table()
    print("Table deleted")
