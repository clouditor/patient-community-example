FROM node:16-alpine as builder
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY yarn.lock ./
RUN yarn install --ignore-engines
COPY . ./
RUN npm install react-scripts
RUN npm install typescript
RUN npm install env-cmd
RUN yarn run build:prod

FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY --from=builder /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000