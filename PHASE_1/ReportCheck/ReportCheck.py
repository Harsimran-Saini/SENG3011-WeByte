import sys
import re
import json
file = sys.argv[1]
search= file.split('.txt')[0]

diseaseName = search

with open(file, 'r') as f:

    disease_list = json.load(f)
    try :
        disease_list[diseaseName]
        for d in disease_list[diseaseName]:

            try:
                d['reports']
            except KeyError:
                print(d)
    except KeyError:
        try:

            diseaseName = diseaseName.replace("+", " ")

            disease_list[diseaseName]
            for d in disease_list[diseaseName]:

                try:
                    d['reports']
                except KeyError:
                    print(d)
        except KeyError:

            print(disease_list)
