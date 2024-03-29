#!/usr/bin/env python3

from jwt.algorithms import ECAlgorithm
from pymongo import MongoClient
from flask_jwt_extended import JWTManager
from flask_jwt_extended import get_jwt
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import create_access_token
from flask import Flask, request
import jwt
import json
import requests
from basic_mondrian_health import health_data_api
import logging
import os, sys

mongo_host = "localhost" if (os.environ.get("MONGO_HOST") is None) else os.environ.get("MONGO_HOST")
phr_db_client = MongoClient("mongodb://" + mongo_host + ":27017/")

db = phr_db_client.patient_data
collection = db.records

app = Flask(__name__)
jwt = JWTManager(app)

auth_host = "localhost" if (os.getenv("AUTH_HOST") is None) else os.getenv("AUTH_HOST")
jwks = requests.get("http://" + auth_host + ":8080/auth/credentials").json()

app.config["JWT_PUBLIC_KEY"] = ECAlgorithm.from_jwk(
    json.dumps(jwks["keys"][0])
)

app.config["JWT_ALGORITHM"] = "ES256"

@app.route("/api/v1/statistics", methods=['GET'])
@jwt_required()
def list_statistics():
    claims = get_jwt()

    if claims["scope"] != "researcher":
        return json.dumps({"error": "Invalid scope"}), 403

    # if there are not enough records, generate some
    while collection.count_documents({}) < 4:
        new_record = health_data_api.generate_record().split(',')
        collection.insert_one({
            "group": new_record[0], 
            "timestamp": new_record[1], 
            "medication": new_record[2], 
            "medication_dosage": new_record[3], 
            "symptom": new_record[4], 
            "symptom_strength": new_record[5]
        })

    cursor = collection.find({}, {"_id": 0, "group": 1, "timestamp": 1, "medication": 1, "medication_dosage": 1, "symptom": 1, "symptom_strength": 1})
    cursor = list(cursor)
    
    # T1 and T3 assume that the anonymization here is not done (well)
    # @Anon<Identifier>
    # anonymized_data = health_data_api.anonymize_mongo_data(cursor)
    anonymized_data = cursor
    return str(anonymized_data), 200

if __name__ == '__main__':
    if len(sys.argv) < 2:
        logging.info("start at port 8084")
        app.run(host='0.0.0.0', port=8084, debug=True, threaded=True)

    p = int(sys.argv[1])
    logging.info("start at port %s" % (p))

    app.run(host='0.0.0.0', port=p, debug=True, threaded=True)
