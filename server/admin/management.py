import firebase_admin
import json
from firebase_admin import credentials, firestore, initialize_app

# Initialize Firestore DB
cred = credentials.Certificate("./key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()
batch = db.batch()

definitions_ref = db.collection('definitions')
sections_ref = db.collection('sections')
users_ref = db.collection('users')

DEFINITIONS_FILE = '../data/definitions.json'
BASE_SECTIONS_FILE = '../data/base_sections.json'


def post_definitions():
    try:
        with open(DEFINITIONS_FILE) as f:
            data = json.load(f)

        total = len(data)
        i = 0
        for key, value in data.items():
            print(f"POSTing definitions: {i}/{total}", end='\r')
            ref = definitions_ref.document(key)
            batch.set(ref, value)
            if (i % 450 == 0):
                batch.commit()
            i += 1
        batch.commit()
    except Exception as e:
        print(f"Error: {e}")

def post_section(section):
    try:
        sections_ref.document(section['id']).set({
            'base_section': True,
            'title': section['title'],
            'content': section['vocabulary']
        })
    except Exception as e:
        print(f"Error: {e}")

def fill_base_sections():
    with open(BASE_SECTIONS_FILE) as f:
        data = json.load(f)

    for section in data:
        post_section(section)



def main():
    # post_definitions()
    fill_base_sections()


if __name__ == '__main__':
    main()