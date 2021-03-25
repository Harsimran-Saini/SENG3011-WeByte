from uploadDatafile import getDBConnection

DEBUG = False
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

if __name__ == "__main__":
    conn = getDBConnection()
    cur = conn.cursor()

    # Upload diseases
    for disease in DISEASE_LIST:
        insertQuery = "INSERT into Diseases(name) VALUES (%s)"
        disease = (disease,)
        print(cur.mogrify(insertQuery, disease))
        cur.execute(insertQuery, disease)
    
    for syndrome in SYNDROME_LIST:
        insertQuery = "INSERT into Syndromes(name) VALUES (%s)"
        syndrome = (syndrome,)
        print(cur.mogrify(insertQuery, syndrome))
        cur.execute(insertQuery, syndrome)
    
    if not DEBUG:
        conn.commit()
    conn.close()