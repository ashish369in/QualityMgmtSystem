# Quality Management System

A web application for tracking quality-related tasks, issues, and training.

## Features

- User Authentication with role-based access control
- Task Management
- Issue Tracking
- Quality Defect Management
- User Management

## Tech Stack

- Frontend: React with TypeScript, Tailwind CSS
- Backend: Express with TypeScript
- State Management: React Query
- Authentication: JWT

## Deployment Instructions

### Backend Deployment (Render.com)

1. Create a new account on [Render.com](https://render.com)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: qms-backend
   - Environment: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Add Environment Variables:
     - NODE_ENV: production
     - PORT: 3000
     - JWT_SECRET: (generate a secure random string)
     - CORS_ORIGIN: (your frontend URL from Vercel)

### Frontend Deployment (Vercel)

1. Create a new account on [Vercel](https://vercel.com)
2. Install Vercel CLI: `npm i -g vercel`
3. Run `vercel login` and follow the instructions
4. From the frontend directory, run `vercel`
5. Configure environment variables in Vercel dashboard:
   - VITE_API_URL: (your backend URL from Render.com)

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```
3. Copy `.env.example` to `.env` in both frontend and backend directories
4. Start the development servers:
   ```bash
   # Backend
   cd backend
   npm run dev

   # Frontend
   cd ../frontend
   npm run dev
   ```

## Default Users

- Admin: username: "admin"
- Quality: username: "qualityuser"
- User: username: "user"

(In development, any password will work)
