from decimal import Decimal
import json
import boto3
import sys
from boto3.dynamodb.conditions import Key

def load_disease(diseases, num, dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb', endpoint_url="https://dynamodb.ap-southeast-2.amazonaws.com")

    table = dynamodb.Table('Data2')
    table2 = dynamodb.Table('Keyword-frequencies')

    response = table2.query(KeyConditionExpression=Key('Keyword').eq("other"))
    table.update_item(
        Key={
            'Keyword': str('other')
        },
        UpdateExpression="set Number_of_articles =:i",
        ExpressionAttributeValues={
            ':i': int(num)
        },
        ReturnValues="UPDATED_NEW"
    )
    for d in diseases:
        response = table.query(KeyConditionExpression=Key('archive_id').eq(int(d['archive_id'])))
        
        # if the id does not exist in the table
        if not response['Items']:
            print()
            print("hi")
            print()
            id = d['archive_id']
            date = d['date']
            disease = "other"
            reports = d['reports']
            main_text = d['main_text']
            headline = d['headline']
            url = d['url']
            keywords = ["other"]
            print("Adding disease:", id, disease)
            table.put_item(Item=d)
        # if the article id already exists
        else:
            # if there is already an attibute keywords
            if "keywords" in response['Items'][0].keys():
                #if other is not in that keywords
                if not ("other" in response['Items'][0]["keywords"]):
                    table.update_item(
                        Key={
                            'article_id': d['archive_id'],
                            'date': d['date']
                        },
                        UpdateExpression="add keywords = list_append(keywords, :i)",
                        ExpressionAttributeValues={
                            ':i': ["other"]
                        },
                        ReturnValues="UPDATED_NEW"
                    )
            # if there is no attribute keyword
            else:
                table.update_item(
                    Key={
                        'article_id': d['archive_id'],
                        'date': d['date']
                    },
                    UpdateExpression="set keywords =:i",
                    ExpressionAttributeValues={
                        ':i': ["other"]
                    },
                    ReturnValues="UPDATED_NEW"
                )



if __name__ == '__main__':
    disease_name = sys.argv[1]
    with open('txtfiles/other.txt', 'r') as json_file:
        disease_list = json.load(json_file, parse_float=Decimal)
        load_disease(disease_list[disease_name], disease_list[disease_name+"num_articles"])