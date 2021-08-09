import firebase_admin
import json
import csv
from firebase_admin import credentials, firestore, initialize_app

# Initialize Firestore DB
cred = credentials.Certificate("../certs/key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()
batch = db.batch()

definitions_ref = db.collection('definitions')
sections_ref = db.collection('sections')
users_ref = db.collection('users')

DICTIONARY_FILE = '../data/dictionary.json'
BASE_SECTIONS_FILE = '../data/base_sections.json'
NEW_HSK_FILE = '../data/new_hsk.csv'

def post_section(section):
    try:
        sections_ref.document(section['id']).set({
            'base_section': True,
            'title': section['title'],
            'words': section['words']
        })
    except Exception as e:
        print(f"Error: {e}")

def post_new_hsk_section(section):
    try:
        sections_ref.document(section['id']).set({
            'base_section': True,
            'new_hsk': True,
            'title': section['title'],
            'words': section['words']
        })
    except Exception as e:
        print(f"Error: {e}")

def post_base_sections():
    with open(BASE_SECTIONS_FILE) as f:
        data = json.load(f)

    print("loaded sections...")

    for section in data:
        print("posting section " + section['id'])
        post_section(section)

def post_new_hsk():
    sections = []
    with open(NEW_HSK_FILE, newline='') as f:
        reader = csv.reader(f, delimiter=',', quotechar='|')
        next(reader, None)
        for row in reader:
            hsk_level = row[0]
            word = row[2]
            added = False
            new_id = 'new_hsk_' + hsk_level
            for section in sections: 
                if section['id'] == new_id:
                    section['words'].append(word)
                    added = True
            if added == False:
                sections.append({
                    'id': new_id,
                    'title': 'HSK ' + hsk_level,
                    'words': [word]
                })
    for section in sections:
        print(section['id'] + ' ' + section['title'] + ' ' + str(len(section['words'])))
        post_new_hsk_section(section)
    print(str(len(sections)))

def main():
    # post_base_sections()
    post_new_hsk()


if __name__ == '__main__':
    main()