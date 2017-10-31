FROM python:3.6.1-onbuild
RUN apt-get update && apt-get install -y gettext  # django i18n needs this
RUN mkdir /src
WORKDIR /src
ADD . /src/
