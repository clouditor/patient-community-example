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
import os
import psycopg2
from configparser import ConfigParser
import hashlib

# user_db connection (PostgreSQL)
postgres_host = os.environ.get("AUTH_POSTGRES_HOST", "localhost")
user = os.environ.get("AUTH_POSTGRES_USER", "postgres")
password = os.environ.get("AUTH_POSTGRES_PASSWORD", "postgres")
dbname = os.environ.get("AUTH_POSTGRES_DB", "postgres")

user_db_con = psycopg2.connect(database=dbname, user=user, password=password, host=postgres_host)

# create a cursor
user_db = user_db_con.cursor()    

# phr_db client (MongoDB)
mongo_host = "localhost" if (os.environ.get("MONGO_HOST") is None) else os.environ.get("MONGO_HOST")
phr_db_client = MongoClient("mongodb://" + mongo_host + ":27017/")

# databse patient_data, collection records
phr_db = phr_db_client.patient_data
phr_db_collection = phr_db.records

app = Flask(__name__)
jwt = JWTManager(app)

auth_host = "localhost" if (os.getenv("AUTH_HOST") is None) else os.getenv("AUTH_HOST")
jwks = requests.get("http://" + auth_host + ":8080/auth/credentials").json()

app.config["JWT_PUBLIC_KEY"] = ECAlgorithm.from_jwk(
    json.dumps(jwks["keys"][0])
)

app.config["JWT_ALGORITHM"] = "ES256"

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
        
        # T2
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

    
    # T2
    # Now we can retrieve the group_data
    # Get group_data for requested group_id
    records = phr_db_collection.find({"group_id": group_id})
    
    records_json = json_util.dumps(records)
    json_data = json.loads(records_json)

    for item in json_data:
        item["user_id"] = item["user_id"].replace(user_id, hash_user_id(user_id))

    # T4
    return json_util.dumps(json_data), 200

def hash_user_id(user_id):
    #@Identifier
    test = "test"
    logging.info(test)
    return hashlib.md5(user_id.encode()).hexdigest()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8085, debug=True, threaded=True)
