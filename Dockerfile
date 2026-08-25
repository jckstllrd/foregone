FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_FOREGONE_API_URL
ENV VITE_FOREGONE_API_URL=$VITE_FOREGONE_API_URL
RUN npm run build

RUN npm install -g serve

CMD serve -s dist -l $PORT
