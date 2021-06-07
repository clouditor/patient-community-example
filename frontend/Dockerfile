FROM node:10-alpine

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY yarn.lock ./

COPY . ./

CMD ["yarn", "start"]