FROM node:16-buster

WORKDIR /app

COPY . .
RUN yarn --production --frozen-lockfile --ignore-scripts
RUN yarn config set unsafe-perm true
RUN yarn global add vite
RUN yarn build
EXPOSE 5000

CMD [ "yarn", "run", "preview"]