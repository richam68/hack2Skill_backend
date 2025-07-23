# hack2Skill_backend

# Task & Subtask Management Backend API

A secure backend API built using **Express.js**, **MongoDB**, and **JWT-based authentication** to manage user tasks and subtasks. It supports **user registration**, **login**, **task/subtask CRUD operations**, **soft deletion**, and **data isolation per user**.

---

## Project Structure

├── controllers/
│ └── userController.js
├── models/
│ └── userModel.js
├── routes/
│ └── userRoutes.js
├── services/
│ └── userService.js
├── .env
├── server.js / app.js
└── README.md

---

## Database Schema Documentation

### User Schema

Each user has:
{
username: String, // required
email: String, // required, unique
password: String, // hashed
tasks: [Task]
}

### User Schema

{
task_id: ObjectId,
subject: String, // required
lastDate: Date, // required
status: "pending" | "in progress" | "completed",
isDeleted: Boolean,
subtasks: [Subtask]
}

## SubTask Schema

{
subtask_id: ObjectId,
subject: String, // required
lastDate: Date, // required
status: "pending" | "in progress" | "completed",
isDeleted: Boolean
}

### Authentication

JWT-based

All /tasks and /subtasks routes are protected.

Include the token in the Authorization header:
Authorization: Bearer <token>

### Auth Routes

## POST /auth/register

### Register a new user

{
"username": "john_doe",
"email": "john@example.com",
"password": "password123"
}

## POST/auth/login

### Login a user

{
"email": "john@example.com",
"password": "password123"
}

## Response

## Users

{
"user": {
"id": "USER_ID",
"email": "john@example.com",
"username": "john_doe",
"accessToken": "JWT_TOKEN"
}
}

## All protected with JWT

## GET /tasks

## Returns all non-deleted tasks and their non-deleted subtasks

## POST /tasks

Create a task with optional subtasks
{
"subject": "Learn Node",
"lastDate": "25/12/2030",
"status": "pending",
"subtasks": [
{
"subject": "Install Node",
"lastDate": "22/12/2030",
"status": "completed"
}
]
}

## PUT /tasks/:taskId

Update an existing task
{
"subject": "Updated Subject",
"lastDate": "31/12/2030",
"status": "in progress"
}

## DELETE /tasks/:taskId

Soft delete a task

## Subtask Routes

## GET /tasks/:taskId/subtasks

Returns non-deleted subtasks of a task

## PUT /tasks/:taskId/subtasks

Replaces the current non-deleted subtasks with the new ones

{
"subtasks": [
{
"subject": "New Subtask 1",
"lastDate": "18/03/2029",
"status": "pending"
},
{
"subject": "New Subtask 2",
"lastDate": "19/03/2029",
"status": "in progress"
}
]
}
Deleted subtasks are preserved in the database.
