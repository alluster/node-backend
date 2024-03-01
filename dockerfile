FROM node:18-alpine

#crete app directory
WORKDIR /app

#Install app depencies 
COPY package*.json ./

#npm install
RUN npm install

#bundle app source
COPY . .

EXPOSE 3000

VOLUME [ "/app/node_modules" ]

CMD [ "npm", "start"]


