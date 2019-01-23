FROM node:10

WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./config/mongo.js /docker-entrypoint-initdb.d/

RUN yarn

COPY . .

EXPOSE 7000

CMD ["yarn", "start"]
