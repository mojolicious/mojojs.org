FROM node:latest
WORKDIR /opt/mojojs

COPY package.json package-lock.json ./

RUN npm ci

COPY index.js .

EXPOSE 3000
ENTRYPOINT ["node", "redirect.js"]
CMD ["server", "--level", "debug"]
