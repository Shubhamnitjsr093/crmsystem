
# CRM Application

A MERN stack CRM (Customer Relationship Management) application with dashboards for tasks, leads, projects, and contacts.

## Features

- Dashboard with summary statistics and charts
- Task management
- Lead tracking
- Project management
- Contact management
- CRUD operations for all entities

## Tech Stack

- MongoDB
- Express.js
- React
- Node.js
- TypeScript
- Tailwind CSS
- Recharts (for charts)
- shadcn/ui components

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```
   npm install
   ```
3. Install backend dependencies:
   ```
   cd src/server
   npm install
   ```

### Running the Application

1. Start MongoDB locally or use MongoDB Atlas

2. Start the backend server:
   ```
   cd src/server
   npm run dev
   ```
   The server will run on http://localhost:5000

3. Start the frontend development server:
   ```
   npm run dev
   ```
   The frontend will run on http://localhost:5173

## API Endpoints

The API provides the following endpoints:

### Tasks
- GET /api/tasks - Get all tasks
- POST /api/tasks - Create a new task
- GET /api/tasks/:id - Get a specific task
- PUT /api/tasks/:id - Update a task
- DELETE /api/tasks/:id - Delete a task

### Leads
- GET /api/leads - Get all leads
- POST /api/leads - Create a new lead
- GET /api/leads/:id - Get a specific lead
- PUT /api/leads/:id - Update a lead
- DELETE /api/leads/:id - Delete a lead

### Projects
- GET /api/projects - Get all projects
- POST /api/projects - Create a new project
- GET /api/projects/:id - Get a specific project
- PUT /api/projects/:id - Update a project
- DELETE /api/projects/:id - Delete a project

### Contacts
- GET /api/contacts - Get all contacts
- POST /api/contacts - Create a new contact
- GET /api/contacts/:id - Get a specific contact
- PUT /api/contacts/:id - Update a contact
- DELETE /api/contacts/:id - Delete a contact
