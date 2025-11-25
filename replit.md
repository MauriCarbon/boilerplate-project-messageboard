# Anonymous Message Board

## Overview
This is a FreeCodeCamp Information Security project - an Anonymous Message Board built with Express.js, Node.js, and PostgreSQL. The application allows users to create message boards, post threads, and reply to threads anonymously.

## Project Structure
- `server.js` - Main Express server application with Helmet security
- `db.js` - PostgreSQL database connection and initialization
- `routes/api.js` - API route handlers for threads and replies
- `routes/fcctesting.js` - FreeCodeCamp testing routes
- `views/` - HTML templates for the frontend
  - `index.html` - Main page with API testing interface
  - `board.html` - Board view showing threads
  - `thread.html` - Individual thread view
- `public/` - Static assets (CSS)
- `tests/` - Functional tests (10 FCC test cases)

## Technology Stack
- Node.js (v20.19.3)
- Express.js - Web framework
- PostgreSQL - Database (Replit integrated)
- Helmet - Security middleware (iFrame protection, DNS prefetching, referrer policy)
- jQuery - Frontend interactivity
- body-parser - Request body parsing
- cors - Cross-origin resource sharing
- dotenv - Environment variable management
- Mocha/Chai - Testing framework

## Security Features (Helmet Configuration)
- `frameguard: sameorigin` - Only allow site to be loaded in iFrame on same origin pages
- `dnsPrefetchControl: allow: false` - Do not allow DNS prefetching
- `referrerPolicy: same-origin` - Only send referrer for same origin pages

## Environment Configuration
- `PORT=5000` - Server port (configured for Replit webview)
- `DATABASE_URL` - PostgreSQL connection string (auto-configured by Replit)
- Server binds to `0.0.0.0` for Replit proxy compatibility

## Database Schema
### Threads Table
- `_id` - Primary key (SERIAL)
- `board` - Board name (VARCHAR)
- `text` - Thread content (TEXT)
- `created_on` - Creation timestamp
- `bumped_on` - Last activity timestamp
- `reported` - Report status (BOOLEAN)
- `delete_password` - Password for deletion

### Replies Table
- `_id` - Primary key (SERIAL)
- `thread_id` - Foreign key to threads
- `text` - Reply content (TEXT)
- `created_on` - Creation timestamp
- `reported` - Report status (BOOLEAN)
- `delete_password` - Password for deletion

## Running the Application
The application is configured to run automatically with the workflow:
- Command: `npm start`
- Access the application through the Replit webview on port 5000

## API Endpoints
- `POST /api/threads/:board` - Create a new thread
- `GET /api/threads/:board` - Get 10 most recent threads with 3 replies each
- `PUT /api/threads/:board` - Report a thread
- `DELETE /api/threads/:board` - Delete a thread (requires password)
- `POST /api/replies/:board` - Post a reply to a thread
- `GET /api/replies/:board?thread_id=` - Get full thread with all replies
- `PUT /api/replies/:board` - Report a reply
- `DELETE /api/replies/:board` - Delete a reply (requires password)

## Deployment
The project is configured for Replit's autoscale deployment:
- Deployment target: `autoscale`
- Run command: `npm start`

## Recent Changes (November 25, 2025)
- Implemented full API functionality for threads and replies
- Added PostgreSQL database with proper schema
- Configured Helmet security headers (iFrame, DNS prefetching, referrer policy)
- Added 10 functional tests for FreeCodeCamp requirements
- Database auto-initializes on server startup
