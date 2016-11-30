FROM node:6.9.1

MAINTAINER Andrei Tretyakov <andrei.tretyakov@gmail.com>

ENV NODE_ENV production

ENV PATH $PATH:/opt/sayhey/bin

RUN mkdir -p /opt/sayhey

COPY . /opt/sayhey

WORKDIR /opt/sayhey

RUN npm install pm2 -g && npm install

EXPOSE 3000

CMD ["/usr/local/bin/pm2", "start", "pm2.json", "--no-daemon"]
