FROM keymetrics/pm2:latest-alpine

# Bundle APP files
COPY src src/
COPY views views/
COPY package.json .
COPY pm2.json .

# Install app dependencies
RUN pm2 install typescript
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production

EXPOSE 3001

CMD [ "pm2-runtime", "start", "pm2.json" ]
