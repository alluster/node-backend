# Node.js Backend API

## Overview

## This API allows users to:

-   Authenticate and manage teams: Users can create teams and invite others.
-   Integrate Google Sheets: Users can fetch data from Google Sheets.
-   Analyze data with OpenAI GPT: Import data from Google Sheets and analyze it using OpenAI's Chat GPT.
-   Subscription management: Users can purchase subscriptions using Stripe.

**Features**

-   **Authentication & Authorization**: JWT-based authentication and invitation management.
-   **PostgreSQL**: Relational database to manage organizations, teams, users, dashboards, and data points.
-   **Stripe** Integration: For subscription management.
-   **Google Cloud Integration**: Fetch Google Sheets using a service account.
-   **OpenAI GPT Integration**: Analyze data imported from Google Sheets.
-   **Docker**: Containerized environment for development and deployment.

**Tech Stack**

-   **Node.js**: Backend framework.
-   **Knex.js**: SQL query builder for PostgreSQL.
-   **PostgreSQL**: Database.
-   **Docker**: Containerization for easy environment management.

### After downloading, execute following steps to develop:

2.  **Migrate Database**

    Navigate into app’s directory and migrate with Knex.js:

    ```shell
    knex:migrate latest
    ```

1.  **Run unit tests**

    Navigate into app’s directory and run tests:

    ```shell
    npm run test
    ```

1.  **Start command**

    Navigate into app’s directory and start it up:

    ```shell
    docker-compose up
    ```

1.  **Access the Database via Adminer**

    ```shell
    localhost:8090
    ```

1.  **Access the API**

    ```shell
    localhost:3000
    ```

### VS Code Extension suggestions for development

-   Rest Client
