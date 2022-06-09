FROM node:latest
WORKDIR /opt/mojojs

COPY package.json package-lock.json index.js fortune.txt ./
COPY plugins ./plugins
COPY public ./public
COPY views ./views

RUN wget https://github.com/mojolicious/mojo.js/archive/refs/heads/main.tar.gz && tar xvf main.tar.gz mojo.js-main/docs --strip-components=1 && rm main.tar.gz

RUN find .

RUN npm i

EXPOSE 3000
ENTRYPOINT ["node", "index.js"]
CMD ["server", "--proxy", "--level", "trace"]
