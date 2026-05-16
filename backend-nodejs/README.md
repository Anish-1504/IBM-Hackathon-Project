# AI Code Review Assistant - Node.js Backend

A Node.js/Express backend implementation for the AI Code Review Assistant, powered by IBM watsonx.ai.

## 🚀 Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **AI Code Analysis**: Integration with IBM watsonx.ai for intelligent code review
- **RESTful API**: Clean and well-documented API endpoints
- **Database**: PostgreSQL with Sequelize ORM
- **Security**: Rate limiting, CORS, helmet, and input validation
- **Error Handling**: Centralized error handling middleware

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- IBM watsonx.ai API credentials

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd backend-nodejs
npm install
```

### 2. Configure Environment

Copy the example environment file and update with your credentials:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ai_code_review
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# IBM watsonx.ai Configuration
WATSONX_API_KEY=your_watsonx_api_key
WATSONX_PROJECT_ID=your_project_id
WATSONX_URL=https://us-south.ml.cloud.ibm.com

# CORS Configuration
CORS_ORIGIN=http://localhost:8080
```

### 3. Setup Database

Create PostgreSQL database:

```bash
createdb ai_code_review
```

Initialize database schema:

```bash
npm run init-db
```

### 4. Start Server

Development mode with auto-reload:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## 📁 Project Structure

```
backend-nodejs/
├── src/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/
│   │   ├── auth.controller.js   # Authentication logic
│   │   └── review.controller.js # Review logic
│   ├── middleware/
│   │   ├── auth.middleware.js   # JWT authentication
│   │   ├── error.middleware.js  # Error handling
│   │   └── rateLimiter.middleware.js # Rate limiting
│   ├── models/
│   │   ├── index.js            # Model initialization
│   │   ├── User.js             # User model
│   │   ├── Review.js           # Review model
│   │   └── Repository.js       # Repository model
│   ├── routes/
│   │   ├── auth.routes.js      # Auth endpoints
│   │   └── review.routes.js    # Review endpoints
│   ├── services/
│   │   ├── ai.service.js       # watsonx.ai integration
│   │   └── review.service.js   # Review business logic
│   ├── utils/
│   │   ├── validators.js       # Input validation
│   │   └── helpers.js          # Utility functions
│   └── server.js               # Application entry point
├── scripts/
│   └── init-db.js              # Database initialization
├── .env.example                # Environment template
├── package.json                # Dependencies
└── README.md                   # This file
```

## 🔌 API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123",
  "fullName": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "John Smith",
  "githubToken": "ghp_xxxxx"
}
```

### Code Reviews

#### Analyze Code
```http
POST /api/reviews/analyze
Authorization: Bearer <token>
Content-Type: application/json

{
  "prDiff": "diff --git a/file.js...",
  "prTitle": "Add new feature",
  "prNumber": 123,
  "repositoryId": "uuid"
}
```

#### Get Review
```http
GET /api/reviews/:id
Authorization: Bearer <token>
```

#### List Reviews
```http
GET /api/reviews?limit=20&offset=0
Authorization: Bearer <token>
```

#### Get Review Statistics
```http
GET /api/reviews/stats
Authorization: Bearer <token>
```

#### Delete Review
```http
DELETE /api/reviews/:id
Authorization: Bearer <token>
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **Input Validation**: express-validator for request validation
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers
- **SQL Injection Protection**: Sequelize ORM with parameterized queries

## 🧪 Testing

Run tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## 📊 Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `username` (String, Unique)
- `password_hash` (String)
- `full_name` (String)
- `github_token` (Text)
- `is_active` (Boolean)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Reviews Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `repository_id` (UUID, Foreign Key, Nullable)
- `pr_number` (Integer)
- `pr_title` (String)
- `pr_diff` (Text)
- `analysis` (JSONB)
- `overall_score` (Float)
- `status` (Enum: pending, completed, failed)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Repositories Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `name` (String)
- `full_name` (String, Unique)
- `description` (Text)
- `url` (String)
- `language` (String)
- `is_private` (Boolean)
- `stars` (Integer)
- `forks` (Integer)
- `last_synced_at` (Timestamp)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_NAME` | Database name | ai_code_review |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | - |
| `JWT_SECRET` | JWT signing key | - |
| `JWT_EXPIRE` | Token expiration | 7d |
| `WATSONX_API_KEY` | IBM watsonx.ai API key | - |
| `WATSONX_PROJECT_ID` | watsonx.ai project ID | - |
| `WATSONX_URL` | watsonx.ai endpoint | - |
| `CORS_ORIGIN` | Allowed CORS origin | * |

## 🚀 Deployment

### Production Checklist

1. ✅ Set `NODE_ENV=production`
2. ✅ Use strong `JWT_SECRET`
3. ✅ Configure proper CORS origins
4. ✅ Enable HTTPS
5. ✅ Set up database backups
6. ✅ Configure logging
7. ✅ Set up monitoring
8. ✅ Use environment-specific configs

### Docker Deployment

```bash
# Build image
docker build -t ai-code-review-backend .

# Run container
docker run -p 3000:3000 --env-file .env ai-code-review-backend
```

## 📝 Development

### Code Style

This project uses ESLint and Prettier for code formatting:

```bash
npm run lint
npm run format
```

### Database Migrations

To create a new migration:

```bash
npm run migration:create -- --name add-new-field
```

To run migrations:

```bash
npm run migrate
```

## 🐛 Troubleshooting

### Database Connection Issues

1. Verify PostgreSQL is running
2. Check database credentials in `.env`
3. Ensure database exists: `createdb ai_code_review`

### watsonx.ai API Issues

1. Verify API key is valid
2. Check project ID is correct
3. Ensure sufficient API quota

### Port Already in Use

Change the port in `.env`:
```env
PORT=3001
```

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📧 Support

For issues and questions:
- Create an issue on GitHub
- Contact: support@example.com

---

Made with ❤️ using Node.js, Express, and IBM watsonx.ai