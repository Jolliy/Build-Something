FROM node:20-alpine
EXPOSE 8080
WORKDIR /src
COPY . .
RUN npm install
CMD ["npm", "run", "dev"]