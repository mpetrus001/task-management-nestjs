# Task Management Project

A simple fullstack task management app with a NestJS REST API and React SPA.

## Description

The project is a simple fullstack task management app. It allows for a user to sign up to the app using an email and password. The user can then preform CRUD operations on their list of tasks which are persisted to a database.

The REST API is a Node app written using the NestJS server platform. NestJS implements a Module-Controller-Service architecture often seen in production-level apps. User authentication is handled with Passport and JWT. Entities are persisted to a postgres database using a Repository pattern with TypeORM.

The SPA using React has yet to be built, but is coming soon!

The project started by completing the coursework for [NestJS Zero To Hero](https://www.udemy.com/course/nestjs-zero-to-hero) with Ariel Weinberger. Completion of the course resulted in an API server about 90% ready for production. Additional features were added to the server and the project was "dockerized".

## Getting Started

### Dependencies

To build and run you will need the following installed

- Git
- Docker
- Docker-Compose

For developement you will need the following installed

- Git
- Node
- Docker
- Docker-Compose

### Running the App

1. Clone the repo

```bash
$ git clone git@github.com:mpetrus001/nestjs-zero-to-hero.git
```

1. Build the image

```bash
$ docker build -t <image_name> .
```

1. Check your environment variables

```bash
$ cp .env.sample .env
$ vim .env
```

1. Start the app

```bash
$ docker-compose up
```

### Developing

1. Clone the repo

```bash
$ git clone git@github.com:mpetrus001/nestjs-zero-to-hero.git
```

1. Install dependencies

```bash
$ npm install
```

1. Start the database

```bash
$ docker-compose -f docker-compose.dev.yml up
```

1. Run the server in watch mode

```bash
$ npm run start:dev
```

## Version History

- See [commit change]() or See [release history]()

## License

This project is licensed under the MIT License - see the LICENSE.md file for details

## Acknowledgments

Primarily based on the coursework for [NestJS Zero To Hero](https://www.udemy.com/course/nestjs-zero-to-hero) with Ariel Weinberger. An excellent introduction to building a production ready app using NestJS and Typescript.

- [NestJS](https://docs.nestjs.com/)
- [Typescript](https://www.typescriptlang.org/)
- [React](https://reactjs.org/docs/getting-started.html)
- [TypeORM](https://typeorm.io/#/)
