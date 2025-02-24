FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

CMD ["echo", "Frontend build completed. Copy files to /usr/share/nginx/html"]
