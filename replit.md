# Anonymous Message Board

## Overview
This is a FreeCodeCamp Information Security project - an Anonymous Message Board built with Express.js and Node.js. The application allows users to create message boards, post threads, and reply to threads anonymously.

## Project Structure
- `server.js` - Main Express server application
- `routes/api.js` - API route handlers for threads and replies
- `routes/fcctesting.js` - FreeCodeCamp testing routes
- `views/` - HTML templates for the frontend
  - `index.html` - Main page with API testing interface
  - `board.html` - Board view showing threads
  - `thread.html` - Individual thread view
- `public/` - Static assets (CSS)
- `tests/` - Functional tests

## Technology Stack
- Node.js (v20.19.3)
- Express.js - Web framework
- jQuery - Frontend interactivity
- body-parser - Request body parsing
- cors - Cross-origin resource sharing
- helmet - Security middleware
- dotenv - Environment variable management

## Environment Configuration
- `PORT=5000` - Server port (configured for Replit webview)
- Server binds to `0.0.0.0` for Replit proxy compatibility

## Running the Application
The application is configured to run automatically with the workflow:
- Command: `npm start`
- Access the application through the Replit webview on port 5000

## API Endpoints
- `POST /api/threads/:board` - Create a new thread
- `GET /api/threads/:board` - Get recent threads for a board
- `PUT /api/threads/:board` - Report a thread
- `DELETE /api/threads/:board` - Delete a thread
- `POST /api/replies/:board` - Post a reply to a thread
- `GET /api/replies/:board` - Get replies for a thread
- `PUT /api/replies/:board` - Report a reply
- `DELETE /api/replies/:board` - Delete a reply

## Deployment
The project is configured for Replit's autoscale deployment:
- Deployment target: `autoscale`
- Run command: `npm start`

## Recent Changes (November 24, 2025)
- Configured PORT environment variable to 5000
- Updated server.js to bind to 0.0.0.0 for Replit compatibility
- Configured workflow for webview output on port 5000
- Set up deployment configuration for production
- Installed all project dependencies
