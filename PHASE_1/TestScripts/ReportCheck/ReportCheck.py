import sys
import re
import json

if __name__=="__main__":

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
                    #Can't find reports in response printing response
                    print(d)
                    sys.exit(3)

        except KeyError:
            try:
                #try renaming + to spaces
                diseaseName = diseaseName.replace("+", " ")

                for d in disease_list[diseaseName]:

                    try:
                        d['reports']
                    except KeyError:
                        #Can't find reports in response printing response
                        print(d)
                        sys.exit(3)

            except KeyError:

                #special cases where the file name disease is very different to the
                #disease key needed to index the response Json
                 special = {
                                'ehec  e coli ' : 'ehec (e.coli)',
                                'hand  foot and mouth disease' : 'hand, foot and mouth disease',
                                'hiv aids' : 'hiv/aids',
                                'influenza a h1n1' : 'influenza a/h1n1',
                                'influenza a h1n2' : 'influenza a/h1n2',
                                'influenza a h3n2' : 'influenza a/h3n2',
                                'influenza a h3n5' : 'influenza a/h3n5',
                                'influenza a h5n1' : 'influenza a/h5n1',
                                'influenza a h7n9' : 'influenza a/h7n9',
                                'influenza a h9n2' : 'influenza a/h9n2'

                 }
                 try:
                     #make sure the response has articles
                     disease_list[special[diseaseName]]
                     try:

                         for d in disease_list[special[diseaseName]]:

                             d['reports']

                     except KeyError:
                         #can't find any reports in response, printing response
                         print(d)
                         sys.exit(3)

                 except KeyError:
                     #Can't find any articles in response printing response
                     print(disease_list)
                     sys.exit(4)

            except KeyError:
                #contains no articles
                print(disease_list)
                sys.exit(4)
