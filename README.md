# Task Manager

## Project Description

Task Manager is a full-stack web application designed to streamline task management processes. Built with modern technologies, this project demonstrates proficiency in React.js for the frontend and Node.js with Express.js for the backend. It provides a robust platform for users to create, organize, and track tasks efficiently.

## Features

- User Authentication and Authorization
- Task Creation, Editing, and Deletion
- Status Management (To Do, In Progress, Completed)
- Priority Levels (Low, Medium, High)
- Due Date Setting
- User Assignment for Tasks
- Task Reporting System

## Technologies Used

- Frontend: React.js
- Backend: Node.js with Express.js
- Database: MongoDB
- Styling: Material-UI

## Getting Started

### Prerequisites

- Node.js (version 14.x or later)
- MongoDB (version 4.x or later)
- npm (Node Package Manager)

### Installation

1. Clone the repository:
git clone https://github.com/njg37/task-manager.git


2. Navigate to the project directory:
cd task-manager


3. Install dependencies:
npm install


4. Set up environment variables:
   Create a `.env` file in the root directory and add your MongoDB connection string and any other necessary configuration.

5. Start the backend server:
node index.js


6. Start the frontend development server:
npm start


## Usage

1. Access the frontend application at `http://localhost:3000`
2. Register or log in to access the task management dashboard
3. Create, edit, and delete tasks as needed
4. Manage task statuses and priorities
5. Assign tasks to users
6. Generate and view task reports

## API Documentation

### Authentication Routes

#### POST /register

Register a new user

Request Body:
json { "username": "string", "email": "string", "password": "string" }


Response:
json { "_id": "ObjectId", "username": "string", "email": "string" }


#### POST /login

Log in an existing user

Request Body:
json { "email": "string", "password": "string" }


Response:
json { "token": "JWT Token", "isAdmin": boolean }


#### POST /logout

Logout a user

Note: This endpoint doesn't require a request body as JWT tokens are stateless.

Response:
json { "message": "Logged out successfully" }


### Task Management Routes

All task routes require authentication via JWT token in the Authorization header.

#### POST /tasks/create

Create a new task

Request Body:
json { "title": "string", "description": "string", "dueDate": "ISO date string", "status": "string", // One of: "To Do", "In Progress", "Completed" "priority": "string", // One of: "Low", "Medium", "High" "assignedUser": "string" // Optional, must be a valid user ID }


Response:
json { "_id": "ObjectId", "title": "string", "description": "string", "dueDate": "ISO date string", "status": "string", "priority": "string", "assignedUser": "ObjectId", "creator": "ObjectId", "createdAt": "ISO date string", "__v": number }


#### GET /tasks

Get tasks for the logged-in user (or all tasks if admin)

Query Parameters:
- status: string
- priority: string
- page: number (default: 1)
- limit: number (default: 10)

Response:
json { "tasks": [ { "_id": "ObjectId", "title": "string", "description": "string", "dueDate": "ISO date string", "status": "string", "priority": "string", "assignedUser": { "_id": "ObjectId", "username": "string", "email": "string" }, "creator": "ObjectId", "createdAt": "ISO date string", "__v": number } ], "totalPages": number, "currentPage": number }


#### PUT /tasks/:id

Update a task

Request Body:
json { "title": "string", "description": "string", "dueDate": "ISO date string", "status": "string", // One of: "To Do", "In Progress", "Completed" "priority": "string", // One of: "Low", "Medium", "High" "assignedUser": "string" // Optional, must be a valid user ID }


Response:
json { "_id": "ObjectId", "title": "string", "description": "string", "dueDate": "ISO date string", "status": "string", "priority": "string", "assignedUser": "ObjectId", "creator": "ObjectId", "createdAt": "ISO date string", "__v": number }


#### DELETE /tasks/:id

Delete a task

Response:
json { "message": "Task deleted successfully" }


#### GET /tasks/report

Generate a task report

Query Parameters:
- status: string
- priority: string
- assignedUser: string
- startDate: ISO date string
- endDate: ISO date string
- format: string (default: "json")

Response:
- JSON: Array of task objects (same structure as GET /tasks)
- CSV: Task data in CSV format

#### GET /tasks

Get all tasks without authentication

Query Parameters:
- page: number (default: 1)

Response:
json { "tasks": [ { "_id": "ObjectId", "title": "string", "description": "string", "dueDate": "ISO date string", "status": "string", "priority": "string", "assignedUser": "ObjectId", "creator": "ObjectId", "createdAt": "ISO date string", "__v": number } ], "totalPages": number }


Note: This route doesn't require authentication but provides limited information about tasks.

## Deployment

Deployment instructions will be added once the project is live.

## Acknowledgments

- Font Awesome: Used for iconography throughout the application.

## Contact

For questions or feedback, please contact Nabajit Ghosh at nabajitghosh225@gmail.com