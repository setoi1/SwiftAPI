FROM node:18-alpine

WORKDIR /app

COPY . .

RUN yarn install --production

EXPOSE 5173

CMD ["yarn", "start"]