# grou-phr-controller

## Install

```
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r requirements.txt
```

## Usage

Get an `ACCESS_TOKEN` from the auth server.

```
curl -H "Authorization: Bearer $ACCESS_TOKEN" -v localhost:8085/api/v1/groupdata/<group_id>/userid/<user_id>
```
