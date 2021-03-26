'''
Called by updating Webscraper on Lambda. Gets reports
'''

import spacy
from spacy.lang.en.stop_words import STOP_WORDS
from string import punctuation
import re
import json
import requests
from dateutil import parser
from heapq import nlargest

GEONAMES_USR = "webyte_seng3011"

DISEASE_LIST = ["unknown",
    "other",
    "anthrax cutaneous",
    "anthrax gastrointestinous",
    "anthrax inhalation",
    "botulism",
    "brucellosis",
    "chikungunya",
    "cholera",
    "cryptococcosis",
    "cryptosporidiosis",
    "crimean-congo haemorrhagic fever",
    "dengue",
    "diphteria",
    "ebola haemorrhagic fever",
    "ehec (e.coli)",
    "enterovirus 71 infection",
    "influenza a/h5n1",
    "influenza a/h7n9",
    "influenza a/h9n2",
    "influenza a/h1n1",
    "influenza a/h1n2",
    "influenza a/h3n5",
    "influenza a/h3n2",
    "influenza a/h2n2",
    "hand, foot and mouth disease",
    "hantavirus",
    "hepatitis a",
    "hepatitis b",
    "hepatitis c",
    "hepatitis d",
    "hepatitis e",
    "histoplasmosis",
    "hiv/aids",
    "lassa fever",
    "malaria",
    "marburg virus disease",
    "measles",
    "mers-cov",
    "mumps",
    "nipah virus",
    "norovirus infection",
    "pertussis",
    "plague",
    "pneumococcus pneumonia",
    "poliomyelitis",
    "q fever",
    "rabies",
    "rift valley fever",
    "rotavirus infection",
    "rubella",
    "salmonellosis",
    "sars",
    "shigellosis",
    "smallpox",
    "staphylococcal enterotoxin b",
    "thypoid fever",
    "tuberculosis",
    "tularemia",
    "vaccinia and cowpox",
    "varicella",
    "west nile virus",
    "yellow fever",
    "yersiniosis",
    "zika",
    "legionares",
    "listeriosis",
    "monkeypox",
    "COVID-19"
    ]

SYNDROME_LIST = [
    "haemorrhagic fever",
    "acute flacid paralysis",
    "acute gastroenteritis",
    "acute respiratory syndrome",
    "influenza-like illness",
    "acute fever and rash",
    "fever of unknown origin",
    "encephalitis",
    "meningitis"
]

LOCATION_BLACKLIST = [
    "healthmap"
]

locationCountryLookup = {} # Local cache of location/country pairs that have already been looked up so we dont waste requests
# Get parent country of location from geonames

def lambda_handler(event, context):
    report = {}
    if 'main_text' in event.keys():
        text = str(event['main_text'])
        nlp = spacy.load("/opt/en_core_web_sm-2.2.5/en_core_web_sm/en_core_web_sm-2.2.5")
        doc = nlp(text)
        
        # Diseases mentioned in article
        diseases = []
        for word in DISEASE_LIST:
            if word in text.lower():
                diseases.append(word)

        # Syndromes mentioned in article
        syndromes = []
        for word in SYNDROME_LIST:
            if word in text.lower():
                syndromes.append(word)

        # Dates mentioned in article
        dates_labelled = [entity.text for entity in doc.ents if entity.label_ == "DATE"]
        dates = []
        for date in dates_labelled:
            # Note: this method of getting dates is a bit too relaxed  (notably, it will interpret any 2 digit string as a date)
            try:
                newDate = parser.parse(date)
                #print(f"Parsed {date} as {newDate}")
                dates.append(str(newDate))
            except Exception as e:
                #print(f"Could not parse {date} as a date: {e}")
                pass
        
        stopwords = list(STOP_WORDS)
        tokens = [token.text for token in doc]
        word_frequencies = {}
        for word in doc:
            if word.text.lower() not in stopwords:
                if word.text.lower() not in punctuation:
                    if word.text not in word_frequencies.keys():
                        word_frequencies[word.text] = 1
                    else:
                        word_frequencies[word.text] += 1
        
        max_frequency = max(word_frequencies.values())
        
        for word in word_frequencies.keys():
            word_frequencies[word] = word_frequencies[word]/max_frequency
            
            
        sentence_tokens = [sent for sent in doc.sents]
        
        sentence_scores = {}
        for sent in sentence_tokens:
            for word in sent:
                if word.text.lower() in word_frequencies.keys():
                    if sent not in sentence_scores.keys():
                        sentence_scores[sent] = word_frequencies[word.text.lower()]
                    else:
                        sentence_scores[sent] += word_frequencies[word.text.lower()]
                        
        select_length = int(len(sentence_tokens)*0.3)
        
        summary = nlargest(select_length, sentence_scores, key=sentence_scores.get)
        
        final_summary = [ word.text for word in summary]
        final_summary = ' '.join(final_summary)
        
        
        def getCountry(location):
            try:
                location = location.lower()
                if (location not in locationCountryLookup.keys()):
                    payload = {'username': GEONAMES_USR, 'q': location, 'maxRows': 1}
                    placeReq = requests.get('http://api.geonames.org/searchJSON', params=payload)
                    placeJSON = json.loads(placeReq.text)
                    country = placeJSON['geonames'][0]['countryName']
                    locationCountryLookup[location] = country

                return locationCountryLookup[location]
            except:
                return 'unknown'
        
        # Unique locations mentioned in article
        location_set = {entity.lemma_ for entity in doc.ents if entity.label_ == "GPE" and entity.lemma_.lower() not in LOCATION_BLACKLIST}
        locations = [{"location": l, "country": getCountry(l)} for l in location_set]
        #print(locations)

        report = {
            "summary": final_summary,
            "report": [{
                "diseases": diseases,
                "syndromes": syndromes,
                "event_date": dates,
                "locations": locations
            }]
        } 
        #print(report)

    # Returns one report for now
    return report
