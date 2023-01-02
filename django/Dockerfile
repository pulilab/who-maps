FROM python:3.11.1-bullseye

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y gettext  # django i18n needs this
RUN pip install --upgrade pip
RUN pip install "setuptools<58.0.0"
RUN curl -sL https://deb.nodesource.com/setup_15.x | bash -
RUN apt-get install -y nodejs python3-psycopg2
RUN npm install -g mapshaper
RUN mkdir /src
WORKDIR /src
ADD requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
ADD . /src/