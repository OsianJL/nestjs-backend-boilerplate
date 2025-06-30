# NestJS Backend Boilerplate

A boilerplate for building scalable, production-ready backend applications with [NestJS](https://nestjs.com/), [Prisma ORM](https://www.prisma.io/), and PostgreSQL. Includes authentication, user management, and a ready-to-use Docker setup.

---

## Features
- NestJS 11
- PostgreSQL with Prisma ORM
- Authentication & user management
- Dockerized for easy local development
- Database seeding and reset scripts

---

## Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd nestjs-backend-boilerplate
```

### 2. Set up environment variables

Create a `.env` file in the root directory. At minimum, you need to define your database connection string:

```
DATABASE_URL=postgres://<user>:<password>@<host>:<port>/<db>
```

> **Note:** Each developer should use their own values according to their local or remote database setup. The default Docker Compose setup uses:
> 
> `postgres://postgres:postgrespassword@localhost:54322/nest_db`

---

## Running with Docker

The project includes a `docker-compose.yml` for local development. This will spin up both the PostgreSQL database and the NestJS app.

```bash
docker-compose up --build
```

- The API will be available at [http://localhost:3000](http://localhost:3000)
- The database will be accessible at port `54322` on your localhost

---

## Database Migrations & Prisma

After setting up your environment and database, run Prisma migrations:

```bash
# Install dependencies (if not using Docker)
npm install

# Run migrations
npx prisma migrate deploy
```

If you need to generate the Prisma client after changing the schema:
```bash
npx prisma generate
```

---

## Seeding and Resetting the Database

There are scripts to seed the database with test users and to reset the user table:

- **Seed:**
  ```bash
  npm run seed
  # or
  npx ts-node prisma/scripts/seed.ts
  ```
  This will create an admin user and several test users.

- **Reset:**
  ```bash
  npm run reset
  # or
  npx ts-node prisma/scripts/reset.ts
  ```
  This will delete all users from the database.

---

## Useful Commands

- **Install dependencies:**
  ```bash
  npm install
  ```
- **Start in development mode:**
  ```bash
  npm run start:dev
  ```
- **Start in production mode:**
  ```bash
  npm run build
  npm run start:prod
  ```
- **Run tests:**
  ```bash
  npm run test
  npm run test:e2e
  ```

---

## API Documentation

Swagger UI is available at [http://localhost:3000/api](http://localhost:3000/api) when the app is running.

---

## Notes
- Make sure your `.env` file is not committed to version control.
- You can customize the database, ports, and credentials in `docker-compose.yml` and your `.env` file.
- For more advanced Prisma usage, see the [Prisma docs](https://www.prisma.io/docs/).

---

## License

MIT
