FROM node:lts

# Creates the directory
RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

# copy and install the bot
COPY package.json /usr/src/bot
RUN npm install

# copies our bot files
COPY . /usr/src/bot

# starts the bot
CMD ["node", "index.js"]