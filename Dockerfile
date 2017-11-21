FROM node:6.11-alpine  
RUN mkdir -p /app  
WORKDIR /app  
COPY package.json .  
RUN npm install  
COPY / .  
EXPOSE 8000
CMD [ "node", "src/server/app.js" ]  