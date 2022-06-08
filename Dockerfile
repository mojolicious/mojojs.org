FROM node:latest
WORKDIR /opt/mojojs

COPY package.json package-lock.json ./

#TODO build from mojojs source repo
RUN npm ci --only=production

COPY index.js .

EXPOSE 3000
ENTRYPOINT ["node", "index.js"]
CMD ["server", "--cluster", "--level", "debug"]
