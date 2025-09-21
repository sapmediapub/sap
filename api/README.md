# Sap Media Publishing API

This is the backend API for the Sap Media Publishing platform, built with Node.js, Express, and Prisma.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm
- Docker and Docker Compose
- A PostgreSQL database (can be run via the top-level `docker-compose.yml`)

### Installation

1.  **Navigate to the API directory:**
    ```bash
    cd api
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Copy the example environment file and fill in your details, especially the `DATABASE_URL` and your Spotify credentials.
    ```bash
    cp .env.example .env
    ```

4.  **Set up the database:**
    Run Prisma's migrate command to create the database schema based on `prisma/schema.prisma`.
    ```bash
    npx prisma migrate dev --name init
    ```

### Running the server

To run the server in development mode with hot-reloading:

```bash
npm run dev
```

The server will be available at `http://localhost:3001` by default.