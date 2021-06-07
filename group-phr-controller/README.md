# phr-manager

## Install

```
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r requirements.txt
```

## Usage

Get a `ACCESS_TOKEN` from the auth server.

```
curl -d '{"blood_pressure": 180}' -H "Authorization: Bearer $ACCESS_TOKEN" -v -XPOST localhost:8085/api/v1/groupdata
curl -H "Authorization: Bearer $ACCESS_TOKEN" -v localhost:8085/api/v1/groupdata
```
