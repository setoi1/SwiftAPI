FROM node:18-alpine

WORKDIR /app

COPY . .

RUN yarn install --production

EXPOSE 8000

CMD ["yarn", "start"]