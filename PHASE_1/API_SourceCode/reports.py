import spacy
import re
import json
import requests
from dateutil import parser

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
        "COVID-19",
        "haemorrhagic fever",
        "acute flacid paralysis",
        "acute gastroenteritis",
        "acute respiratory syndrome",
        "influenza-like illness",
        "acute fever and rash",
        "fever of unknown origin",
        "encephalitis",
        "meningitis"]

SYNDROME_LIST = [
    "haemorrhagic fever",
    "acute flacid paralysis",
    "acute gastroenteritis",
    "acute respiratory syndrome",
    "influenza-like illness",
    "acute fever and rash",
    "fever of unknown origin",
    "encephalitis",
    "meningitis",
]

LOCATION_BLACKLIST = [
    "healthmap"
]

def reports(text):
    # Requires: python -m spacy download en_core_web_sm
    nlp = spacy.load("en_core_web_sm")
    #print(text)
    doc = nlp(text)
    # Analyze syntax
    #print("Noun phrases:", [chunk.text for chunk in doc.noun_chunks])
    #print("Nouns:", [token.lemma_ for token in doc if token.pos_ == "NOUN"])
    # Find named entities, phrases and concepts
    #for entity in doc.ents:
    #    print(entity.text, entity.label_)
    
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

    # Unique locations mentioned in article
    location_set = {entity.lemma_ for entity in doc.ents if entity.label_ == "GPE" and entity.lemma_.lower() not in LOCATION_BLACKLIST}
    locations = [{"location": l, "country": getCountry(l)} for l in location_set]
    #print(locations)

    report = {
        "diseases": diseases,
        "syndromes": syndromes,
        "event_date": dates,
        "locations": locations
    } 
    #print(report)

    # Returns one report for now
    return [report]

locationCountryLookup = {} # Local cache of location/country pairs that have already been looked up so we dont waste requests
# Get parent country of location from geonames
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


example_article = "JAPANESE ENCEPHALITIS & OTHER - INDIA (01): (BIHAR)\n***************************************************\nA ProMED-mail post\nhttp://www.promedmail.org\nProMED-mail is a program of the\nInternational Society for Infectious Diseases\nhttp://www.isid.org\n\nDate: Fri 19 Feb 2021\nSource: BusinessWorld [edited]\nhttp://www.businessworld.in/article/One-Encephalitis-case-detected-in-Bihar-s-Muzaffarpur-/19-02-2021-379392/\n\n\nA child in Bihar's Muzaffarpur has been detected with symptoms of acute encephalitis syndrome (AES) in Shrikrishna Medical College and Hospital (SKMCK), and paediatrics department has confirmed the case on Friday [19 Feb 2021].\n\n\"Paediatrics department yesterday [Thu 18 Feb 2021] confirmed one case of AES in Muzaffarpur's SKMC Hospital,\" hospital superintendent Dr BS Jha said. \"We are prepared to deal with this case; we have arranged the medicines. There will be a review meeting on 24 Feb [2021] with concerned officials regarding the case.\"\n\nIn October 2020, a total of 77 children were admitted to SKMCH hospital with AES/Japanese encephalitis.\n\nAES is a viral disease that causes flu-like symptoms such as high fever, vomiting, and, in extreme cases, brain dysfunction, seizure, and inflammation of the heart and kidney.\n\n--\nCommunicated by:\nProMED from HealthMap Alerts\n<promed@promedmail.org>\n\n[Although there are fewer cases of acute encephalitis syndrome (AES) and Japanese encephalitis (JE) in Bihar state this year [2021] than in previous years, these cases continue to occur in that state. From 27 Mar 2020 until 1 Nov 2020, 89 children suffering from AES/JE were admitted to Muzaffarpur's Shrikrishna Medical College & Hospital in Bihar.\n\nThe above and previous reports do not indicate how many of the AES cases are due to Japanese encephalitis. As mentioned in many previous ProMED posts, the issue of the etiology of AES has been under discussion for a long time. AES has continued to be attributed to various etiologies, including Reye syndrome-like disease, possible Japanese encephalitis (JE), enterovirus infection from polluted water, heatstroke, scrub typhus (_Orientia tsutsugamushi_), and intoxication from lychee fruit consumption. Dr. T. Jacob John noted that hypoglycemic encephalopathy is triggered by litchi consumption, and Muzaffarpur, Vaishali, East Champaran, and Sitamarhi are litchi-growing districts in Bihar. These 4 are non-Japanese encephalitis districts (see Japanese encephalitis & other - India (12): (BR) 20200831.7730992 and Japanese encephalitis & other - India (12): (BR) corr, comment 20200902.7740196). A recent publication states that dengue virus is one of the 3 most common agents identified in AES, but existing surveillance for AES does not include routine testing for dengue.\n\nThe report above does not indicate whether any of the etiologies above have been ruled out or confirmed. Until the etiology (or etiologies) of these AES cases is determined, effective and efficient prevention of cases will not be possible. The season in which AES and JE cases occur is underway, and additional cases can be expected over the coming 2-3 months. - Mod.TY\n\nHealthMap/ProMED map:\nMuzaffarpur, Bihar, India: http://healthmap.org/promed/p/58423]\nSee Also\n2020\n----\nJapanese encephalitis & other - India (14): (BR) 20201114.7942386\nJapanese encephalitis & other - India (12): (BR) corr, comment 20200902.7740196\nJapanese encephalitis & other - India (12): (BR) 20200831.7730992\nJapanese encephalitis & other - India (11): (BR) 20200813.7676074\nJapanese encephalitis & other - India (04): (BR) 20200511.7321107\nJapanese encephalitis & other - India (03): (BR) 20200428.7278100\nJapanese encephalitis & other - India (02): (BR) 20200419.7238745\nJapanese encephalitis & other - India: (BR) 20200331.7163711\n.................................................sb/jh/ty/tw/jh"
if __name__ == "__main__":
    print(reports(example_article))
