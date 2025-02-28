# Project Overview
The Subscription Tracker API is a backend service designed to manage user subscriptions effectively. It offers functionalities such as user authentication, authorization, subscription management, and workflow automation. The API is built using Node.js with the Express framework and utilizes MongoDB for data storage.

# Features and Functionality
- User Authentication: Secure user registration and login using JWT tokens.
- Subscription Management: Create, read, update, and delete subscription records.
- Workflow Automation: Automate subscription-related workflows using Upstash's workflow service.
- Error Handling: Centralized error handling middleware to manage application errors.

# Technical Details
- Programming Language: JavaScript (ES6 modules)
- Framework: Express.js
- Database: MongoDB with Mongoose ODM
- Authentication: JWT (JSON Web Tokens)
- Middleware: Custom middlewares for error handling and workflow automation
- Additional Libraries:
  - cookie-parser for parsing cookies
  - bcryptjs for password hashing
  - dayjs for date manipulation
  - dotenv for environment variable management
  - morgan for HTTP request logging
  - nodemailer for sending emails
 
# Endpoints
## 1. Authentication Routes
- Sign Up
  - Method: POST
  - Path: /api/v1/auth/sign-up
  - Description: Registers a new user.
- Sign In
  - Method: POST
  - Path: /api/v1/auth/sign-in
  - Description: Authenticates an existing user and returns a JWT.
- Sign Out
  - Method: POST
  - Path: /api/v1/auth/sign-out
  - Description: Logs out the current user.
## 2. User Routes
- Get All Users
  - Method: GET
  - Path: /api/v1/users
  - Description: Retrieves a list of all users.
- Get User by ID
  - Method: GET
  - Path: /api/v1/users/{id}
  - Description: Retrieves a user by their unique ID.
- Update User
  - Method: PUT
  - Path: /api/v1/users/{id}
  - Description: Updates user information.
- Delete User
  - Method: DELETE
  - Path: /api/v1/users/{id}
  - Description: Deletes a user by their unique ID.
## 3. Subscription Routes
- Get All Subscriptions
  - Method: GET
  - Path: /api/v1/subscriptions
  - Description: Retrieves a list of all subscriptions.
- Get User Subscriptions
  - Method: GET
  - Path: /api/v1/subscriptions/user/{id}
  - Description: Retrieves subscriptions for a specific user.
- Create Subscription
  - Method: POST
  - Path: /api/v1/subscriptions
  - Description: Creates a new subscription.
- Update Subscription
  - Method: PUT
  - Path: /api/v1/subscriptions/{id}
  - Description: Updates an existing subscription.
- Delete Subscription
  - Method: DELETE
  - Path: /api/v1/subscriptions/{id}
  - Description: Deletes a subscription by its unique ID.
