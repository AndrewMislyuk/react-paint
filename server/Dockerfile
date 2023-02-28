FROM node:16-alpine as builder
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build 

EXPOSE 3001
CMD ["node", "dist/index.js"]
