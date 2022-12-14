# BOILERPLATE API

## đŦ Instruction:

Create a REST api that allows to create 2d and 3d points and to calculate their distances. The api must respect the CRUD model 

## đ Requirements

- NodeJS installed
- MongoDB database running on your machine
    - You can install it <a href="https://www.mongodb.com/docs/manual/administration/install-community/">here</a>
    - Or run it thanks to my docker compose with command: 
    ```console
    docker-compose build; docker-compose up -d
    ```

## âšī¸ Informations 

This api include:

- đ MongoDB database
- đĒ PROD and DEV environment
- đĄ High level of protection (HTTP headers, anti-dos, ip filter, protected routes)
- đ Express routing 
- â¨ Structured api

## đ  Installation

```bash
$> git clone git@github.com:nexus9111/geometrie_api.git
$> cd geometrie_api
$> npm i
$> cp .env.example .env
// edit .env as you need
```

## đ  Run

Basic run: 

```bash
$> npm start
```

Run with autoreload on modif:

```bash
$> npm i -g nodemon
$> npm run dev
```

Run with prod variables:

```bash
$> npm run prod
```

## âī¸ License

- Author: Joss C
- Last update: 11/18/2022