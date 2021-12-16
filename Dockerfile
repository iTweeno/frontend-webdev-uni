FROM node:16-buster

WORKDIR /app

COPY . .
RUN yarn --production --frozen-lockfile --ignore-scripts
RUN yarn build
EXPOSE 5000

CMD [ "yarn", "run", "preview"]