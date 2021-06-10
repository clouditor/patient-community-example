FROM debian:stable-slim as builder

RUN apt update
RUN apt install -y git

RUN git clone https://github.com/clouditor/Basic_Mondrian.git

FROM python:3.9-slim

RUN mkdir /Basic_Mondrian
COPY --from=builder /Basic_Mondrian /Basic_Mondrian
WORKDIR /Basic_Mondrian
RUN pip3 install .
WORKDIR /
COPY requirements.txt .
RUN sed -i '1d' requirements.txt
RUN pip3 install --no-cache-dir -r requirements.txt

COPY app.py /
WORKDIR /

EXPOSE 8084

CMD ["python", "app.py", "8084"]