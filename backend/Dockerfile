FROM node:18
WORKDIR /app
COPY . .
RUN npm install express cors mysql2
EXPOSE 3000
CMD ["node", "server.js"]
