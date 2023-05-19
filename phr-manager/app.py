#!/usr/bin/env python3

from jwt.algorithms import ECAlgorithm
from pymongo import MongoClient
from flask_jwt_extended import JWTManager
from flask_jwt_extended import get_jwt
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from flask import Flask, request
from bson import json_util
import sys, os
import logging
import json
import requests
import psycopg2

# user_db connection (PostgreSQL)
postgres_host = os.environ.get("AUTH_POSTGRES_HOST", "localhost")
user = os.environ.get("AUTH_POSTGRES_USER", "postgres")
password = os.environ.get("AUTH_POSTGRES_PASSWORD", "postgres")
dbname = os.environ.get("AUTH_POSTGRES_DB", "postgres")

user_db_con = psycopg2.connect(database=dbname, user=user, password=password, host=postgres_host)

# create a cursor
user_db = user_db_con.cursor()

mongo_host = "localhost" if (os.environ.get("MONGO_HOST") is None) else os.environ.get("MONGO_HOST")
client = MongoClient("mongodb://" + mongo_host + ":27017/")

db = client.patient_data
collection = db.records

app = Flask(__name__)
jwt = JWTManager(app)

auth_host = "localhost" if (os.environ.get("AUTH_HOST") is None) else os.environ.get("AUTH_HOST")
jwks = requests.get("http://" + auth_host + ":8080/auth/credentials").json()

app.config["JWT_PUBLIC_KEY"] = ECAlgorithm.from_jwk(
    json.dumps(jwks["keys"][0])
)

app.config["JWT_ALGORITHM"] = "ES256"


@app.route("/api/v1/data", methods=['POST'])
@jwt_required()
def post_data():
    # In a secure application, the user id should be taken from the jwt: user_id = get_jwt_identity()
    claims = get_jwt()

    content = request.json
    user_id = content["userId"]
    group_id = content["groupId"]

    if content is None:
        return json.dumps({"error": "Empty content"}), 400

    if claims["scope"] != "patient":
        return json.dumps({"error": "Invalid scope"}), 403

    # check if user is in the group that is specified in the PHR
    group_ids_list = []
    user_db.execute("""SELECT group_id FROM group_members WHERE user_id=(%s)""", (user_id))
    rows = user_db.fetchall()

    for row in rows:
        group_ids_list.append(row[0])
    # Checks if requesting user has the requested group_id
    # D5: a user can try to request data for another user/group combination and learn about which user is in which group
    if group_id not in group_ids_list:
        return json.dumps({"error": "user is not in the specified group"}), 404

    if sys.version_info.minor > 9:
        phr = {"user_id": user_id} | content #only python 3.9+
    else:
        z = {"user_id": user_id}
        phr = {**z, **content}

    phr_id = collection.insert_one(phr).inserted_id

    # NR2: user's sensitive action is logged
    logging.info("User %s submitted record %s", user_id, phr_id)

    return json_util.dumps(phr), 200


@app.route("/api/v1/data", methods=['GET'])
@jwt_required()
def list_data():
    user_id = get_jwt_identity()
    claims = get_jwt()

    if claims["scope"] != "patient":
        return json.dumps({"error": "Invalid scope"}), 403

    records = collection.find({"user_id": user_id})

    return json_util.dumps(records), 200


if __name__ == '__main__':
    if len(sys.argv) < 2:
        logging.info("start at port 8083")
        app.run(host='127.0.0.1', port=8083, debug=True, threaded=True)

    p = int(sys.argv[1])
    logging.info("start at port %s" % (p))

    app.run(host='0.0.0.0', port=p, debug=True, threaded=True)
    