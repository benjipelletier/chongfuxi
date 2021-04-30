import firebase_admin
import json
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

def post_section(section):
    try:
        sections_ref.document(section['id']).set({
            'base_section': True,
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



def main():
    post_base_sections()


if __name__ == '__main__':
    main()