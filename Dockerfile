FROM node:16.14.2-alpine3.14
ENV PORT 8080
EXPOSE 8080
WORKDIR /app
COPY . .
# RUN npm ci
# RUN npm run build && npm prune --production
# CMD [ "node", "dist/main" ]
CMD [ "node", "./sn/index.js" ]