FROM python:3.9-slim

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py /
WORKDIR /

ENV AUTH_HOST=auth-service
ENV MONGO_HOST=mongo

EXPOSE 8083

CMD ["python", "app.py", "8083"]