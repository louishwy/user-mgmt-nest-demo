# User Management System

A User Management System built with NestJS

## Features

- CRUD operations with pagination
- PostgreSQL database with Docker
- Migrations & Seeds
- Swagger API documentation
- Unit tests with Jest
- Logging system
- Rate limiting (10 requests/minute)
- API versioning (v1)

## Getting Started

### Prerequisites

- Node.js >= 20.x
- npm >= 9.x
- Docker Desktop

### Installation

**1. Clone and install:**
```bash
git clone & npm install
```

**2. Configure environment:**
```bash
cp .env.example .env
# default values work with docker-compose
```

**3. Start the PostgreSQL database:**
```bash
docker-compose up -d
```

**4. Run database migrations:**
```bash
npm run migration:run
```

**5. Seed the database with test data:**
```bash
npm run seed
```

**6. Start the server:**
```bash
npm run start:dev
```

**7. Access the application:**
- API: `http://localhost:3000`
- Swagger docs: `http://localhost:3000/documentation`
- Database: PostgreSQL on `localhost:5432`

## API Endpoints

### User Management

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/v1/users` | Create a new user | CreateUserDto |
| GET | `/v1/users` | Get all users (paginated) | Query: page, limit |
| GET | `/v1/users/:id` | Get user by ID | - |
| PATCH | `/v1/users/:id` | Update user | UpdateUserDto |
| DELETE | `/v1/users/:id` | Delete user | - |

## Testing

**Run tests:**
```bash
npm test
```

**Swagger documentation:** `http://localhost:3000/documentation`

**Postman:** Import `User-Management-API.postman_collection.json`
