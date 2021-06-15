FROM python:3.9-slim

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py /
WORKDIR /

EXPOSE 8085

CMD ["python", "app.py", "8085"]