#  docker build -t mpetrus/task-management-nestjs:latest .

FROM node:latest

ENV NODE_EN=production

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install --production

COPY ["./src", "nest-cli.json", "tsconfig.json", "tsconfig.build.json", "./"]

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]
