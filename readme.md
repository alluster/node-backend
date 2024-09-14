# Node.js backend API

## API built for users to:

-   Authenticate
-   Create teams
-   Invite users
-   Integrate to their Google Sheets
-   Import data from Google Sheets and ask Open AI Chat GPT for data analysis
-   Purchase subscription using Stripe

## Backend API's serving a large business logic bundle:

-   Authentication and authorization using JWT, user invitations
-   PostgreSQL database: organisations, teams, users, dashboards & data points
-   Stripe purchase logic integration to API and database
-   Open AI chat GPT Integration for data analysis
-   Google Cloud Integration for fetching Google Sheets using a service account

### Made with:

-   Node.js
-   Knex.js
-   PostgreSQL
-   Docker

### After downloading, execute following steps to develop:

2.  **Migrate Database**

    Navigate into site’s directory and migrate with Knex.js:

    ```shell
    knex:migrate latest
    ```

1.  **Run unit tests**

    Navigate into site’s directory and run tests:

    ```shell
    npm run test
    ```

1.  **Start command**

    Navigate into site’s directory and start it up:

    ```shell
    docker-compose up
    ```

1.  **In your browser navigate to**

    ```shell
    localhost:8090
    ```

    **VS Code Extension suggestions for development**

-   Rest Client
