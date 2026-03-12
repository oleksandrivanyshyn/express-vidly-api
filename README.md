# 🎬 Vidly API - Video Rental Backend

A robust, production-ready RESTful API designed for managing a video rental service. Built with **Node.js, Express, and TypeScript**, it features secure JWT authentication, role-based authorization, and comprehensive error handling. The core business logic was developed using strict **Test-Driven Development (TDD)** principles.

🔗 **Live API:** [https://express-vidly-api.onrender.com/]

## 🛠 Tech Stack

**Backend Framework & Language:**
- **Node.js** (JavaScript runtime)
- **Express 5** (Web framework with native async error handling)
- **TypeScript** (End-to-end type safety)

**Database & Data Modeling:**
- **MongoDB** (NoSQL Database)
- **Mongoose** (ODM with Rich Domain Model implementation)

**Validation, Auth & Observability:**
- **Joi** (Strict payload validation)
- **JSON Web Tokens (JWT) & bcryptjs** (Authentication and password hashing)
- **Winston** (Advanced error logging and transport management)

**Testing:**
- **Jest & Supertest** (Unit and full API Integration testing)

---

## 🚀 Getting Started

Follow these steps to set up the backend application locally.

### 🛠️ Local Development Setup

1. **Clone the repository:**
```bash
git clone [https://github.com/your-username/vidly-api.git](https://github.com/your-username/vidly-api.git)
cd vidly-api

```

2. **Install dependencies:**

```bash
npm install

```

3. **Set up environment variables:**
Create a `.env` file in the root directory. You will need to configure your database connection and JWT secret:

```env
PORT=3000
JWT_PRIVATE_KEY="your_super_secret_key"
DB_URI="mongodb://127.0.0.1:27017/vidly"
NODE_ENV="development"

```

4. **Run the test suite (TDD):**
Ensure all integration and unit tests are passing before starting:

```bash
npm run test

```

5. **Run the development server:**

```bash
npm run dev

```

6. **Build for Production:**
Compile the TypeScript code to JavaScript:

```bash
npm run build
npm start

```

---

## 📂 Project Highlights

### ✅ Architecture & TDD Focus

* **Test-Driven Development (TDD):** The core returns API and business logic were written by writing failing tests first, ensuring high reliability and code coverage.
* **Rich Domain Model:** Business logic (like calculating rental fees and processing returns) is encapsulated directly within Mongoose models following the Information Expert principle, keeping controllers clean.
* **Express 5 Async Handling:** Leverages the latest Express version to natively handle asynchronous promise rejections without needing external `try-catch` wrappers or third-party async-error libraries.

### 🖼 Features

* **Authentication & Authorization:** Secure endpoints using JWT. Includes role-based access control (e.g., only Admin users can delete data).
* **Relational Data in NoSQL:** Implements a hybrid approach using referenced and embedded documents to optimize read queries for movies, genres, and rentals.
* **Robust Validation:** Two-layer validation using Joi for incoming HTTP requests and Mongoose schemas for database integrity.
* **Production Observability:** Fully integrated with Winston for logging errors to files and tracking uncaught exceptions/rejections.
