# Docker Node.js + PostgreSQL Backend with Adminer database viewer

1. Create .env file and add variables according to .env.example

2. Run the docker-composer in your project root terminal:

$ docker-compose up

Adminer database view should be available on localhost:8090

3. Migrate database:

$ npm run migrate

4. Roll back database to clear changes:

$ npm run rollback
