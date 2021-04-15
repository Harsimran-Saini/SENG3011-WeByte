import boto3


def createDiseaseTable(dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb', endpoint_url="https://dynamodb.ap-southeast-2.amazonaws.com")

    table = dynamodb.create_table(
        TableName='Data',
        KeySchema=[
            {
                'AttributeName': 'archive_id',
                'KeyType': 'HASH'  # Partition key
            },
            {
                'AttributeName': 'disease',
                'KeyType': 'RANGE'  # Sort key
            }
        ],
        AttributeDefinitions=[
            {
                'AttributeName': 'archive_id',
                'AttributeType': 'N'
            },
            {
                'AttributeName': 'disease',
                'AttributeType': 'S'
            },


        ],
        ProvisionedThroughput={
            'ReadCapacityUnits': 10,
            'WriteCapacityUnits': 10
        }
    )
    return table


if __name__ == '__main__':
    disease_table = createDiseaseTable()
    print("Table status:", disease_table.table_status)
