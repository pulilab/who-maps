FROM ubuntu:16.04
RUN apt-get update && apt-get install -y python3 curl git ssh tar gzip ca-certificates
RUN curl -sL https://deb.nodesource.com/setup_9.x | bash
RUN apt-get install -y nodejs
RUN apt-get install -y build-essential