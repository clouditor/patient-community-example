FROM python:3.9-slim

RUN apt-get -y update
RUN apt-get install -y libpq-dev gcc

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py /
WORKDIR /

EXPOSE 8085

CMD ["python", "app.py", "8085"]