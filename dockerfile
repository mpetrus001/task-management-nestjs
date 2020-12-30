# docker build -t mpetrus/task-management-nestjs:latest .
#
# used this file when started getting build errors during npm install
# docker save -o ~/projects/images/tm-nestjs.tar mpetrus/task-management-nestjs:1.0.1

FROM node:14-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]
COPY ["nest-cli.json", "tsconfig.json", "tsconfig.build.json", "./"]
COPY ["./dist", "./dist"]
COPY ["./node_modules", "./node_modules"]

EXPOSE 3000

CMD ["node", "dist/main.js"]
