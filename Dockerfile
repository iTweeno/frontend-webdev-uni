FROM node:16-buster

WORKDIR /app

COPY . .
RUN yarn
RUN yarn config set unsafe-perm true
RUN yarn global add vite
EXPOSE 5000

CMD yarn build ; yarn serve