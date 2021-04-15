
from decimal import Decimal
import json
import boto3
import sys
from boto3.dynamodb.conditions import Key
from boto3.dynamodb.types import TypeSerializer
my_name = "cholera"
name_of_file = 'cholera.txt'

def formatReport(report):
    seri = TypeSerializer()

    report = seri.serialize(report)
    return report

def load_disease(diseases, num, dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb', endpoint_url="https://dynamodb.ap-southeast-2.amazonaws.com")


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
        try:
            d['reports'] = formatReport(d['reports'])
        except KeyError:
            print(d)


    # for d in diseases:
    #     table = dynamodb.Table('Data2')
    #     response = table.query(KeyConditionExpression=Key('archive_id').eq(int(d['archive_id'])))
    #     # if the id does not exist in the table
    #     if not response['Items']:
    #         response = client.put_item(
    #             TableName = 'Data2',
    #             Item={
    #                 "archive_id": {'N': d['archive_id']},
    #                 'date': {'S': d['date']},
    #                 'disease': {'S': my_name},
    #                 'reports': {'L': d['reports']},
    #                 'main_text': {'S': d['main_text']},
    #                 'headline': {'S': d['headline']},
    #                 "url": {'S': d['url']},
    #                 'keywords': {'SS': [my_name]}
    #             }
    #         )
    #
    #         response = client.update_item(
    #             TableName = 'Data2',
    #             Key={
    #                 "archive_id": {'N': d['archive_id']},
    #                 'date': {'S': d['date']}
    #             },
    #             UpdateExpression="set ",
    #             ExpressionAttributeValues={
    #                 'disease': {'S': my_name},
    #                 'reports': {'L': d['reports']},
    #                 'main_text': {'S': d['main_text']},
    #                 'headline': {'S': d['headline']},
    #                 "url": {'S': d['url']},
    #                 'keywords': {'SS': [my_name]}
    #             }
    #         )

        # if the article id already exists
        # else:
        #     # if there is already an attibute keywords
        #     if "keywords" in response['Items'][0].keys():
        #         print("hi2")
        #         #if my_name is not in that keywords
        #         if my_name not in response['Items'][0]["keywords"]:
        #             print("wtf")
        #             response = client.update_item(
        #                 TableName = 'Data2',
        #                 Key={
        #                     "archive_id": {'N': d['archive_id']},
        #                     'date': {'S': d['date']}
        #                 },
        #                 UpdateExpression="add keywords = list_append(keywords, :i)",
        #                 ExpressionAttributeValues={
        #                     ':i': {'SS': [my_name]}
        #                 }
        #             )
        #     # if there is no attribute keyword
        #     else:
        #         response = client.update_item(
        #             TableName = 'Data2',
        #             Key={
        #                 "archive_id": {'N': d['archive_id']},
        #                 'date': {'S': d['date']}
        #             },
        #             UpdateExpression="set keywords =:i",
        #             ExpressionAttributeValues={
        #                 ':i': {'SS': [my_name]}
        #             }
        #         )

if __name__ == '__main__':
    disease_name = sys.argv[1]
    with open(name_of_file, 'r') as json_file:
        disease_list = json.load(json_file, parse_float=Decimal)
        load_disease(disease_list[disease_name], disease_list[disease_name+"num_articles"])
