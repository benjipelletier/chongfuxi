from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore, initialize_app

# Initialize Flask app
app = Flask(__name__)

# Initialize Firestore DB
cred = credentials.Certificate("./admin/key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

definitions_ref = db.collection('definitions')
users_ref = db.collection('users')
progress_ref = db.collection('progress')
sections_ref = db.collection('sections')


@app.route('/')
def home():
    return 'cool'

@app.route('/definitions', methods=['POST'])
def post_definitions():
    char = request.json['char']
    data = request.json['data']
    try:
        definitions_ref.document(char).set(data)
    except Exception as e:
        return f"Error: {e}"
        
    return jsonify({"success": True}), 200

@app.route('/user_progress', methods=['POST'])
def post_user_progress():
    try:
        user = request.json['user_id']
        char = request.json['char']
        # progress_ref.document(user).collection('data').document
    except Exception as e:
        return f"Error: {e}"
    return jsonify({"success": True}), 200

@app.route('/sections', methods=['POST'])
def post_sections():
    try:
        title = request.json['title']
        content = request.json['content']
        sections_ref.add({
            'base_section': False,
            'title': title,
            'content': content
        })
    except Exception as e:
        return f"Error: {e}"
    return jsonify({"success": True}), 200


if __name__ == '__main__':
    app.run(debug=True)