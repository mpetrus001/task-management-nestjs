#  docker build -t mpetrus/task-management-nestjs:latest .

FROM node:14-alpine AS BUILD_IMAGE

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install --production

COPY ["./src", "./src"]
COPY ["nest-cli.json", "tsconfig.json", "tsconfig.build.json", "./"]

RUN npm run build

FROM node:14-alpine

WORKDIR /app

COPY --from=BUILD_IMAGE ["/app/dist", "./dist"]
COPY --from=BUILD_IMAGE ["/app/node_modules", "./node_modules"]

EXPOSE 3000

CMD ["node", "dist/main.js"]
