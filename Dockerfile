FROM node:16-bullseye-slim

RUN npm install -g pm2
# RUN pm2 install typescript

WORKDIR /app
RUN apt-get update && apt-get install -y ca-certificates wget && wget https://s3.amazonaws.com/rds-downloads/rds-combined-ca-bundle.pem && wget https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem && apt-get autoremove -y wget

# Bundle APP files
COPY src src/
COPY views views/
COPY package.json .
COPY pm2.json .
COPY tsconfig.json .

# Install app dependencies
RUN pm2 install typescript
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install

CMD [ "pm2-runtime", "start", "pm2.json" ]
