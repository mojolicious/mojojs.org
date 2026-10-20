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
# Install mojo.js dependencies so typedoc resolves its own type packages
RUN cd mojo.js-main && npm install --ignore-scripts

RUN find .

RUN npm i
RUN npm run build:reference

EXPOSE 3000
ENTRYPOINT ["node", "index.js"]
CMD ["server", "--proxy", "--level", "trace"]
