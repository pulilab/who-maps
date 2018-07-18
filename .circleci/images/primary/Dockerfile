FROM ubuntu:17.10
RUN apt-get update && apt-get install -y  python3-dev  curl git ssh tar gzip ca-certificates
RUN curl https://bootstrap.pypa.io/get-pip.py | python3.6
RUN curl -sL https://deb.nodesource.com/setup_9.x | bash
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update
RUN apt-get install -y nodejs
RUN apt-get install -y build-essential yarn
