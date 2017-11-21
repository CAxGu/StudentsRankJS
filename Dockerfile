FROM node:6.11-alpine  
RUN mkdir -p /ranking 
WORKDIR /ranking/  
COPY / .
RUN ls -la ./*
RUN npm install  
EXPOSE 8000
CMD [ "node", "./src/server/app.js" ]  