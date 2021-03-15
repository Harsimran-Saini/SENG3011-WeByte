 from decimal import Decimal
import json
import boto3
import sys
from boto3.dynamodb.conditions import Key
import boto3.dynamodb.types

my_name = "unknown"
name_of_file = '../unknown.txt'

def load_disease(diseases, num, dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb', endpoint_url="https://dynamodb.ap-southeast-2.amazonaws.com")

    table = dynamodb.Table('Data2')
    table2 = dynamodb.Table('Keyword-frequencies')

    client = boto3.client('dynamodb')

    response = client.update_item(
        TableName = 'Keyword-frequencies',
        Key={
            "Keyword": {'S': my_name}
        },
        UpdateExpression="SET Number_of_articles = :val",
        ExpressionAttributeValues={
            ":val": {'N': num}
        }
    )

    for d in diseases:
        response = table.query(KeyConditionExpression=Key('archive_id').eq(int(d['archive_id'])))
        
        # if the id does not exist in the table
        if response['Items'] == []:
            d={
                archive_id: d['archive_id'],
                date: d['date'],
                disease: my_name,
                reports: d['reports'],
                main_text: d['main_text'],
                headline: d['headline'],
                url: d['url'],
                keywords: [my_name]
            }
            print("Adding disease:", id, disease)
            table.put_item(Item=d)
        # if the article id already exists
        else:
            # if there is already an attibute keywords
            if "keywords" in response['Items'][0].keys():
                print("hi2")
                #if my_name is not in that keywords
                if my_name not in response['Items'][0]["keywords"]:
                    print("wtf")
                    response = client.update_item(
                        TableName = 'Data2',
                        Key={
                            "archive_id": {'N': d['archive_id']},
                            'date': {'S': d['date']}
                        },
                        UpdateExpression="add keywords = list_append(keywords, :i)",
                        ExpressionAttributeValues={
                            ':i': {'SS': [my_name]}
                        },
                    )
            # if there is no attribute keyword
            else:
                response = client.update_item(
                    TableName = 'Data2',
                    Key={
                        "archive_id": {'N': d['archive_id']},
                        'date': {'S': d['date']}
                    },
                    UpdateExpression="set keywords =:i",
                    ExpressionAttributeValues={
                        ':i': {'SS': [my_name]}
                    },
                )

if __name__ == '__main__':
    disease_name = sys.argv[1]
    with open(name_of_file', 'r') as json_file:
        disease_list = json.load(json_file, parse_float=Decimal)
        load_disease(disease_list[disease_name], disease_list[disease_name+"num_articles"])
