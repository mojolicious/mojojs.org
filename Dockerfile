FROM node:latest
WORKDIR /opt/mojojs

COPY package.json package-lock.json index.js fortune.txt ./
COPY bin ./bin
COPY plugins ./plugins
COPY public ./public
COPY controllers ./controllers
COPY views ./views

COPY news ./news

RUN wget https://github.com/mojolicious/mojo.js/archive/refs/heads/main.tar.gz && tar xvf main.tar.gz
WORKDIR /opt/mojojs/mojo.js-main
RUN npm i && npm run build

WORKDIR /opt/mojojs
#RUN find .

# install local checkout of @mojojs/core which overrides in package.json
RUN npm i ./mojo.js-main
RUN npm i
RUN npm run build:reference

EXPOSE 3000
ENTRYPOINT ["node", "index.js"]
CMD ["server", "--proxy", "--level", "trace"]
