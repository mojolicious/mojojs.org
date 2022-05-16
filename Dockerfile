FROM node:latest
WORKDIR /opt/mojojs

COPY package.json package-lock.json ./

#TODO build from mojojs source repo
RUN npm ci --only=production

COPY index.js .
RUN wget https://github.com/mojolicious/mojo.js/archive/refs/heads/main.tar.gz && tar xvf main.tar.gz mojo.js-main/docs --strip-components=1 && rm main.tar.gz
RUN mv docs/images/ ./public/

EXPOSE 3000
ENTRYPOINT ["node", "index.js"]
CMD ["server", "--cluster", "--level", "debug"]

