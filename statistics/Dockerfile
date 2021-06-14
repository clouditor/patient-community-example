FROM python:3.9-slim

RUN apt update
RUN apt install -y git

WORKDIR /
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

COPY app.py /
WORKDIR /
EXPOSE 8084

CMD ["python", "app.py", "8084"]