# Backend Services for User and Payment Management

This repository contains two backend services:<br/>

- user-service: Manages user accounts.
- payment-service: Handles payment transactions, account balances, and other payment-related operations.

Both services are built with Node.js using the Fastify framework and are containerized using Docker. 
The services are connected to PostgreSQL databases for persistent storage.

### Prerequisites
Before setting up the services, ensure you have the following installed:</br>
`Node.js (v18.8.0 or later)` </br>
`Docker and Docker Compose`</br>
`PostgreSQL (for local development without Docker)`</br>

### 1 Getting Started
1. Clone the Repository
  `git clone : https://github.com/elsadaysianturi/be-assignment/`

2. Set Up Environment Variables
Create a .env file in the root of each service (user-service, payment-service) with the following contents:
      - For user-service:
`DATABASE_URL=postgres://user:password@users_db:5432/users_db `
      - For payment-service:
`DATABASE_URL=postgres://user:password@payment_db:5432/payment_db`
3. Build and Start the Services
Use Docker Compose to build and start the services:
`docker-compose up -d`
4. Run Database Migrations
After starting the containers, run the database migrations for each service:
      - For user-service:
`docker-compose exec user-service npx prisma migrate deploy`

   -  For payment-service:
`docker-compose exec payment-service npx prisma migrate deploy`

5. Access the Services

Once the services are running, you can access them at:

   `User Service: http://localhost:3000   ` </br>
   `Payment Service: http://localhost:3001   `</br>

6. View API Documentation
Both services have Swagger documentation available at:

User Service Documentation: `http://localhost:3000/docs`</br>
Payment Service Documentation: `http://localhost:3001/docs`</br>

### 2. Development
Running Locally without Docker
1. Install dependencies:
`cd user-service`</br>
`npm install`</br>
`cd ../payment-service`</br>
`npm install`</br>
2. Set up PostgreSQL databases locally and adjust the DATABASE_URL in the `.env` files accordingly.
3. Run the services:
For user-service:
`npm start`</br>
For payment-service:
`npm start`</br>

