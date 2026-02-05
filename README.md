# Ticketing Management System

A full-stack ticketing management system built with Node.js, Express, PostgreSQL, and React. This application allows users to create, manage, and track support tickets with role-based access control.

## Project Overview

This system provides a complete solution for managing support tickets with the following features:

- **User Authentication**: Secure registration and login with JWT tokens
- **Role-Based Access Control**: Admin and User roles with different permissions
- **Ticket Management**: Create, read, update, and delete tickets
- **Ticket Status Tracking**: Track tickets through OPEN, IN_PROGRESS, RESOLVED, and CLOSED states
- **Priority Levels**: Categorize tickets by LOW, MEDIUM, HIGH, or URGENT priority
- **Search & Filtering**: Search tickets and filter by status or priority
- **Pagination**: Efficiently browse large numbers of tickets

## Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | - | Runtime environment |
| Express | 5.2.1 | Web framework |
| PostgreSQL | - | Database |
| Sequelize | 6.37.7 | ORM for database operations |
| JSON Web Token | 9.0.3 | Authentication tokens |
| bcrypt | 6.0.0 | Password hashing |
| dotenv | 17.2.3 | Environment variables |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI library |
| React Router DOM | 7.13.0 | Client-side routing |
| Vite | 5.0.8 | Build tool & dev server |

### Development & Testing
| Technology | Purpose |
|------------|---------|
| Jest | Unit testing framework |
| Nodemon | Development server with hot reload |

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/jampong-dev/ticketing-management-system.git
cd ticketing-management-system
```

### 2. Install Backend Dependencies
```bash
npm install
```

### 3. Install Frontend Dependencies
```bash
cd src/client
npm install
cd ../..
```

### 4. Environment Configuration
Create a `.env` file in the root directory:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ticketing_db
DB_USER=your_username
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_key_here
```

### 5. Database Setup
Ensure PostgreSQL is running and create the database:
```sql
CREATE DATABASE ticketing_db;
```

The application will automatically sync models on startup.

### 6. Run the Application

**Development Mode (Backend)**
```bash
npm run dev
```

**Development Mode (Frontend)**
```bash
cd src/client
npm run dev
```

**Production Mode**
```bash
npm start
```

### 7. Run Tests
```bash
npm test
```

## Project Structure

```
ticketing-management-system/
├── src/
│   ├── index.js                 # Application entry point
│   ├── server/
│   │   ├── controllers/         # Request handlers
│   │   │   ├── auth/            # Authentication controllers
│   │   │   └── ticket/          # Ticket controllers
│   │   ├── middleware/          # Express middleware
│   │   │   ├── authMiddleware.js
│   │   │   ├── authorizeMiddleware.js
│   │   │   ├── errorHandler.js
│   │   │   └── validateInput.js
│   │   ├── models/              # Sequelize models
│   │   │   ├── User.js
│   │   │   ├── Role.js
│   │   │   └── Ticket.js
│   │   ├── routes/              # API routes
│   │   │   ├── auth/
│   │   │   └── ticket/
│   │   ├── utils/               # Utility functions
│   │   │   ├── AppError.js
│   │   │   └── asyncHandler.js
│   │   └── __tests__/           # Unit tests
│   └── client/                  # React frontend
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── context/
│       │   └── routes/
│       └── vite.config.js
└── package.json
```

## API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |

### Tickets
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/tickets` | Get all tickets | Admin |
| GET | `/api/tickets/my-tickets` | Get user's tickets | Authenticated |
| GET | `/api/tickets/:id` | Get ticket by ID | Authenticated |
| POST | `/api/tickets` | Create new ticket | Authenticated |
| PUT | `/api/tickets/:id` | Update ticket | Owner/Admin |
| PUT | `/api/tickets/:id/status` | Update ticket status | Admin |
| DELETE | `/api/tickets/:id` | Delete ticket | Owner/Admin |

## Security Approach

### Authentication & Authorization
- **JWT Tokens**: Stateless authentication using JSON Web Tokens with 5-minute expiration
- **Password Hashing**: User passwords are hashed using bcrypt with salt rounds of 10
- **Role-Based Access Control**: Two roles (ADMIN, USER) with different permission levels
- **Protected Routes**: Middleware checks for valid tokens before allowing access


## Testing Approach

### Unit Testing with Jest
The project includes unit tests for core backend functionality:

1. **Auth Controller Tests** (`authController.test.js`)
   - Tests user registration (success, duplicate user, missing role)
   - Tests user login (success, invalid credentials, wrong password)

2. **Ticket Controller Tests** (`ticketController.test.js`)
   - Tests ticket creation
   - Tests ticket retrieval (by ID, all tickets)
   - Tests ticket updates
   - Tests ticket deletion
   - Tests status updates with timestamps

3. **Auth Middleware Tests** (`authMiddleware.test.js`)
   - Tests valid token authentication
   - Tests missing token handling
   - Tests invalid/expired token handling
   - Tests token signature verification

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Structure
- Tests use Jest's mocking capabilities to isolate units
- Models are mocked to avoid database dependencies
- Each test follows the Arrange-Act-Assert pattern
- Tests cover both success and error scenarios

## License

ISC
