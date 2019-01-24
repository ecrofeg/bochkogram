FROM node:10

WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./config/mongo.js /docker-entrypoint-initdb.d/

RUN yarn

COPY ./src .

EXPOSE 7000

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

CMD /wait && yarn start
