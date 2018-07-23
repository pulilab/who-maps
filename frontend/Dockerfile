FROM node:8.11.1-alpine
# This is to allow yarn to install from github
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN echo "NODE_ENV=production" >> .env

ADD package.json yarn.lock /tmp/
RUN cd /tmp && yarn
RUN cd /usr/src/app && ln -s /tmp/node_modules

COPY . /usr/src/app/
RUN yarn build

# start command
CMD [ "yarn", "start" ]

