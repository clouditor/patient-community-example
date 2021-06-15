#!/usr/bin/env python3

from jwt.algorithms import ECAlgorithm
from pymongo import MongoClient, database
from flask_jwt_extended import JWTManager
from flask_jwt_extended import get_jwt
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from flask import Flask, request
from bson import json_util
import json
import requests
import psycopg2
from configparser import ConfigParser
import hashlib

# user_db connection (PostgreSQL)
user_db_con = psycopg2.connect(database="postgres", user="postgres", password="postgres", host="localhost")
# create a cursor
user_db = user_db_con.cursor()    

# phr_db client (MongoDB)
phr_db_client = MongoClient("mongodb://localhost:27017/")

# databse patient_data, collection records
phr_db = phr_db_client.patient_data
phr_db_collection = phr_db.records

app = Flask(__name__)
jwt = JWTManager(app)

jwks = requests.get("http://localhost:8080/auth/credentials").json()

app.config["JWT_PUBLIC_KEY"] = ECAlgorithm.from_jwk(
    json.dumps(jwks["keys"][0])
)

app.config["JWT_ALGORITHM"] = "ES256"

# TODO pseudonymized and randomized user_id -> hash of user_id + string?
# TODO psuedonymization configurable?

@app.route("/api/v1/groupdata/<int:group_id>", methods=['GET'])
@jwt_required()
def list_groupdata(group_id=0):
    user_id = get_jwt_identity()
    claims = get_jwt()
    # records = []

    if claims["scope"] != "patient":
        return json.dumps({"error": "Invalid scope"}), 403

    # Get group_ids from user_DB (PostgreSQL)
    # First, we need all assigned group_ids of the requesting user
    try:
        group_ids_list = []
        
        user_db.execute("""SELECT group_id FROM group_members WHERE user_id=(%s)""", (user_id))
        rows = user_db.fetchall()

        for row in rows:
            group_ids_list.append(row[0])

        # Checks if requesting user has the requested group_id
        if group_id not in group_ids_list:
            return json.dumps({"error": "user has no permission for the requested group_id"}), 403

    except Exception as e:
        print("err: ", e)
        return json.dumps({"error": "user_db request"}), 500

    
    # Now we can retrieve the group_data
    # Get group_data for requested group_id
    records = phr_db_collection.find({"group_id": group_id})
    
    records_json = json_util.dumps(records)
    json_data = json.loads(records_json)

    for item in json_data:
        item["user_id"] = item["user_id"].replace(user_id, hash_user_id(user_id))

    return json_util.dumps(json_data), 200

def hash_user_id(user_id):
    return hashlib.md5(user_id.encode()).hexdigest()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8085, debug=True, threaded=True)