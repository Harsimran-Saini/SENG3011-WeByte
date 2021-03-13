import boto3
from boto3.dynamodb.conditions import Key


def query_table(id,date, dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb', endpoint_url="http://localhost:8000")

    table = dynamodb.Table('Data')
    response = table.query(
        KeyConditionExpression=Key('archive_id').eq(id)
    )
    return response['Items']


if __name__ == '__main__':
    date = "2020-09-27 15:02:35"
    id = 7811532
    print(f"diseases from {date}")
    movies = query_table(id,date)
    for movie in movies:
        print(movie['archive_id'], ":", movie["date"])
