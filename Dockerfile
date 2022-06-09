FROM node:latest
WORKDIR /opt/mojojs

COPY package.json package-lock.json index.js fortune.txt ./
COPY plugins ./plugins
COPY public ./public
COPY views ./views
RUN find .

RUN npm i

EXPOSE 3000
ENTRYPOINT ["node", "index.js"]
CMD ["server", "--proxy", "--level", "trace"]
