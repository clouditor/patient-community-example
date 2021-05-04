#!/usr/bin/env python3
from jwt.algorithms import ECAlgorithm
from pymongo import MongoClient
from flask_jwt_extended import JWTManager
from flask_jwt_extended import get_jwt
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import create_access_token
from flask import Flask
from bson import json_util
import sys
import logging
import jwt
import json
import requests
import datetime

client = MongoClient("mongodb://localhost:27017/")

db = client.patient_data
collection = db.records

app = Flask(__name__)
jwt = JWTManager(app)

jwks = requests.get("http://localhost:8080/auth/credentials").json()

app.config["JWT_PUBLIC_KEY"] = ECAlgorithm.from_jwk(
    json.dumps(jwks["keys"][0])
)

app.config["JWT_ALGORITHM"] = "ES256"


@app.route("/api/v1/data", methods=['POST'])
@jwt_required()
def post_data():
    user_id = get_jwt_identity()
    claims = get_jwt()

    if claims["scope"] != "patient":
        return json.dumps({"error": "Invalid scope"}), 403

    phr = {"user_id": user_id,
           "blood_pressure": 180}

    phr_id = collection.insert_one(phr).inserted_id

    print("Inserted record %s" % phr_id)

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
    app.run(host='0.0.0.0', port=8082, debug=True, threaded=True)
