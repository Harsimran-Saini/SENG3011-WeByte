'''
Please NOTE!!!
This is calling lambda functions therefore only works from lambda!!!!!!
PLease use from Lambda repo!!!!!!
For results on these tests see results file Test_scraper_results.txt
'''

import json
import boto3
import unittest

tc = unittest.TestCase()
client = boto3.client('lambda')
client2 = boto3.client('s3')

def lambda_handler(event, context):
        
    def test_scrape_free_keyword():
    
        input_for_invoker = {
          "start_date": "20200329",
          "end_date": "20210317",
          "number_of_articles_to_scrape": 3,
          "start_index": 0,
          "keyword": "other"
        }
        response = client.invoke(
            FunctionName='arn:aws:lambda:ap-southeast-2:733638017875:function:testing-sim',
            InvocationType='RequestResponse',
            Payload=json.dumps(input_for_invoker)
            )
        
        
        responseJson = json.load(response['Payload'])
        with open('testing_scrape_free_keyword', 'r') as infile:
            expected = json.load(infile)
            tc.assertEqual(len(responseJson["other"]), len(expected["other"]))
            # must only scrape 3 articles!
            tc.assertEqual(len(responseJson["other"]), 3)
            for i in range (0,3):
                tc.assertEqual(responseJson["other"][i]["archive_id"], expected["other"][i]["archive_id"])
                tc.assertEqual(responseJson["other"][i]["headline"], expected["other"][i]["headline"])
                tc.assertEqual(responseJson["other"][i]["url"], expected["other"][i]["url"])
                tc.assertEqual(responseJson["other"][i]["date"], expected["other"][i]["date"])
                tc.assertEqual(responseJson["other"][i]["main_text"], expected["other"][i]["main_text"])
                tc.assertEqual(responseJson["other"][i]["summary"], expected["other"][i]["summary"])
                tc.assertEqual(len(responseJson["other"][i]["reports"]), len(expected["other"][i]["reports"]))
                for j in range(0, len(responseJson["other"][i]["reports"])):
                    tc.assertListEqual(responseJson["other"][i]["reports"][j]["diseases"], expected["other"][i]["reports"][j]["diseases"])
                    tc.assertListEqual(responseJson["other"][i]["reports"][j]["syndromes"], expected["other"][i]["reports"][j]["syndromes"])
                    tc.assertListEqual(responseJson["other"][i]["reports"][j]["event_date"], expected["other"][i]["reports"][j]["event_date"])
                    reports_responseJson = sorted(responseJson["other"][i]["reports"][j]["locations"], key = lambda i: (i['location'], i['country']))
                    reports_expected = sorted(expected["other"][i]["reports"][j]["locations"], key = lambda i: (i['location'], i['country']))
                    tc.assertEqual(len(reports_responseJson), len(reports_expected))
                    for k in range(0,len(reports_responseJson)):
                        tc.assertEqual(reports_responseJson[k]["location"], reports_expected[k]["location"])
                        # Because of limitations on API calls the below may return "unknown" sometimes
                        a = reports_responseJson[k]["country"] == reports_expected[k]["country"]
                        b = reports_responseJson[k]["country"] == "unknown" 
                        c = reports_expected[k]["country"] == "unknown"
                        assert a or b or c
            # If you are here then assert has passed
            infile.close()
            return "True"
            
    
    def test_free_keyword_not_enough_articles():
    
        input_for_invoker = {
          "start_date": "20200329",
          "end_date": "20210317",
          "number_of_articles_to_scrape": 3,
          "start_index": 15,
          "keyword": "other"
        }
        response = client.invoke(
            FunctionName='arn:aws:lambda:ap-southeast-2:733638017875:function:testing-sim',
            InvocationType='RequestResponse',
            Payload=json.dumps(input_for_invoker)
            )
        
        responseJson = json.load(response['Payload'])
        
        with open('test_free_keyword_not_enough_articles', 'r') as infile:
            expected = json.load(infile)
            tc.assertEqual(len(responseJson["other"]), len(expected["other"]))
            # must only scrape 3 articles!
            tc.assertEqual(len(responseJson["other"]), 1)
            for i in range (0,1):
                tc.assertEqual(responseJson["other"][i]["archive_id"], expected["other"][i]["archive_id"])
                tc.assertEqual(responseJson["other"][i]["headline"], expected["other"][i]["headline"])
                tc.assertEqual(responseJson["other"][i]["url"], expected["other"][i]["url"])
                tc.assertEqual(responseJson["other"][i]["date"], expected["other"][i]["date"])
                tc.assertEqual(responseJson["other"][i]["main_text"], expected["other"][i]["main_text"])
                tc.assertEqual(responseJson["other"][i]["summary"], expected["other"][i]["summary"])
                tc.assertEqual(len(responseJson["other"][i]["reports"]), len(expected["other"][i]["reports"]))
                for j in range(0, len(responseJson["other"][i]["reports"])):
                    tc.assertListEqual(responseJson["other"][i]["reports"][j]["diseases"], expected["other"][i]["reports"][j]["diseases"])
                    tc.assertListEqual(responseJson["other"][i]["reports"][j]["syndromes"], expected["other"][i]["reports"][j]["syndromes"])
                    tc.assertListEqual(responseJson["other"][i]["reports"][j]["event_date"], expected["other"][i]["reports"][j]["event_date"])
                    reports_responseJson = sorted(responseJson["other"][i]["reports"][j]["locations"], key = lambda i: (i['location'], i['country']))
                    reports_expected = sorted(expected["other"][i]["reports"][j]["locations"], key = lambda i: (i['location'], i['country']))
                    tc.assertEqual(len(reports_responseJson), len(reports_expected))
                    for k in range(0,len(reports_responseJson)):
                        tc.assertEqual(reports_responseJson[k]["location"], reports_expected[k]["location"])
                        # Because of limitations on API calls the below may return "unknown" sometimes
                        a = reports_responseJson[k]["country"] == reports_expected[k]["country"]
                        b = reports_responseJson[k]["country"] == "unknown" 
                        c = reports_expected[k]["country"] == "unknown"
                        assert a or b or c
            infile.close()
            # If you are here then assert has passed
            return "True"
            
    def test_scrape_free_keyword_no_articles_to_scrape():
    
        input_for_invoker = {
          "start_date": "20200329",
          "end_date": "20210317",
          "number_of_articles_to_scrape": 3,
          "start_index": 16,
          "keyword": "other"
        }
        response = client.invoke(
            FunctionName='arn:aws:lambda:ap-southeast-2:733638017875:function:testing-sim',
            InvocationType='RequestResponse',
            Payload=json.dumps(input_for_invoker)
            )
        
        responseJson = json.load(response['Payload'])
        
        with open('test_free_keyword_no_articles', 'r') as infile:
            expected = json.load(infile)
            tc.assertEqual(len(responseJson["other"]), len(expected["other"]))
            # must only scrape 3 articles!
            tc.assertEqual(len(responseJson["other"]), 0)
            infile.close()
            return "True"
            
    def test_scrape_free_keyword_no_date_restrictions():
    
        input_for_invoker = {
          "number_of_articles_to_scrape": 3,
          "start_index": 16,
          "keyword": "other"
        }
        response = client.invoke(
            FunctionName='arn:aws:lambda:ap-southeast-2:733638017875:function:testing-sim',
            InvocationType='RequestResponse',
            Payload=json.dumps(input_for_invoker)
            )
        
        responseJson = json.load(response['Payload'])
        
        with open('test_scrape_free_keyword_no_date_restrictions', 'r') as infile:
            expected = json.load(infile)
            tc.assertEqual(len(responseJson["other"]), len(expected["other"]))
            # must only scrape 3 articles!
            tc.assertEqual(len(responseJson["other"]), 3)
            for i in range (0,3):
                tc.assertEqual(responseJson["other"][i]["archive_id"], expected["other"][i]["archive_id"])
                tc.assertEqual(responseJson["other"][i]["headline"], expected["other"][i]["headline"])
                tc.assertEqual(responseJson["other"][i]["url"], expected["other"][i]["url"])
                tc.assertEqual(responseJson["other"][i]["date"], expected["other"][i]["date"])
                tc.assertEqual(responseJson["other"][i]["main_text"], expected["other"][i]["main_text"])
                tc.assertEqual(responseJson["other"][i]["summary"], expected["other"][i]["summary"])
                tc.assertEqual(len(responseJson["other"][i]["reports"]), len(expected["other"][i]["reports"]))
                for j in range(0, len(responseJson["other"][i]["reports"])):
                    tc.assertListEqual(responseJson["other"][i]["reports"][j]["diseases"], expected["other"][i]["reports"][j]["diseases"])
                    tc.assertListEqual(responseJson["other"][i]["reports"][j]["syndromes"], expected["other"][i]["reports"][j]["syndromes"])
                    tc.assertListEqual(responseJson["other"][i]["reports"][j]["event_date"], expected["other"][i]["reports"][j]["event_date"])
                    reports_responseJson = sorted(responseJson["other"][i]["reports"][j]["locations"], key = lambda i: (i['location'], i['country']))
                    reports_expected = sorted(expected["other"][i]["reports"][j]["locations"], key = lambda i: (i['location'], i['country']))
                    tc.assertEqual(len(reports_responseJson), len(reports_expected))
                    for k in range(0,len(reports_responseJson)):
                        tc.assertEqual(reports_responseJson[k]["location"], reports_expected[k]["location"])
                        # Because of limitations on API calls the below may return "unknown" sometimes
                        a = reports_responseJson[k]["country"] == reports_expected[k]["country"]
                        b = reports_responseJson[k]["country"] == "unknown" 
                        c = reports_expected[k]["country"] == "unknown"
                        assert a or b or c
            infile.close()
            # If you are here then assert has passed
            return "True"

    
    
    print('____________________________________Test 1____________________________________')
    print('    Testing scrape a free keyword with all inputs provided:')
    print('    { "start_date": "20200329", "end_date": "20210317","number_of_articles_to_scrape": 3,"start_index": 0,"keyword": "other"}')
    print('    Test Passed = ' + test_scrape_free_keyword())
    print('____________________________________Test 2____________________________________')
    print('    Testing scrape a free keyword with only 1 article in the date range:')
    print('    { "start_date": "20200329", "end_date": "20210317","number_of_articles_to_scrape": 3,"start_index": 15,"keyword": "other"}')
    print('    Test Passed = ' + test_free_keyword_not_enough_articles())
    print('____________________________________Test 3____________________________________')
    print('    Testing scrape a free keyword with no articles in the date range:')
    print('    { "start_date": "20200329", "end_date": "20210317","number_of_articles_to_scrape": 3,"start_index": 16,"keyword": "other"}')
    print('    Test Passed = ' + test_scrape_free_keyword_no_articles_to_scrape())
    print('____________________________________Test 4____________________________________')
    print('    Testing scrape a free keyword without number_of_articles_to_scrape input provided:')
    print('    { "number_of_articles_to_scrape": 3, "start_index": 0,"keyword": "other"}')
    print('    Test Passed = ' + test_scrape_free_keyword_no_date_restrictions())
