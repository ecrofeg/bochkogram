FROM nginx:stable

ARG REACT_APP_NODE_SOCKET_URL=http://node:7000/

RUN apt-get update
RUN apt-get install -y curl gnupg2
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install yarn

COPY . .

RUN yarn
RUN REACT_APP_NODE_SOCKET_URL=${REACT_APP_NODE_SOCKET_URL} yarn build

RUN cp -a ./build/. /usr/share/nginx/html/

EXPOSE 80
