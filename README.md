Todo Application
This repository contains a full-stack Todo application built with Node.js, Express, MongoDB, and Angular. The application allows users to register, login, and manage their todo items with various statuses. The project includes both backend and frontend code, with detailed instructions on how to install and run the application.

Table of Contents
Features
Technologies Used
Installation
Running the Application
API Endpoints
Frontend Components
Contributing
License

Features
User registration and authentication
CRUD operations for todo items
Filtering todo items by status
Secure password storage with bcrypt
JWT-based authentication
Responsive and interactive UI built with Angular
Technologies Used
Backend: Node.js, Express, MongoDB, Mongoose, bcrypt, JWT
Frontend: Angular, TypeScript, RxJS, Angular Forms, Angular HTTP Client

Installation
Prerequisites
Node.js (v14 or higher)
MongoDB

Backend Installation
Clone the repository:
git clone https://github.com/your-username/todo-app.git
cd todo-app

Install backend dependencies:
cd backend
npm install

Configure environment variables in app.js:
const DB_URI = 'mongodb://localhost:27017/project';
const SECRET_KEY = 'your_secret_key';

Start the backend server:
node app.js

Frontend Installation
Navigate to the frontend directory:
cd ../frontend

Install frontend dependencies:
npm install

Start the frontend development server:
ng serve

The backend will be running on http://localhost:8000 and the frontend on http://localhost:4200.

Running the Application
Start the backend server:
cd backend
node app.js

Start the frontend server:
cd frontend
ng serve

Open a web browser and navigate to http://localhost:4200 to access the application.

API Endpoints
POST /api/register: Register a new user
POST /api/login: Login and obtain a JWT token
GET /api/todo: Fetch all todos (authentication required)
POST /api/todo: Create a new todo (authentication required)
PUT /api/todo/:id: Update a todo (authentication required)
DELETE /api/todo/:id: Delete a todo (authentication required)
Frontend Components
TodoComponent: Main component to manage todos
TodoCardComponent: Displays individual todo items
SlidePanelComponent: Slide-out panel for adding/editing todos
NotificationService: Handles display of notifications
Contributing
Contributions are welcome! Please submit a pull request or open an issue to discuss any changes.

License
This project is licensed under the MIT License.

