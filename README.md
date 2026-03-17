# Campus Flow

A modular, theme-agnostic platform for university event coordination.

## Project Structure

This project is organized as a monorepo:

- **frontend/**: React + Vite application (UI)
- **backend/**: Node.js + Express + MongoDB application (API)

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (Local or Cloud URL)

### Setup

1.  **Backend Setup**
    ```bash
    cd backend
    npm install
    # Create .env file with MONGODB_URI and JWT_SECRET
    npm run dev
    ```

2.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## Features

- **User Authentication**: Student and Organizer roles (Backend implemented).
- **Event Discovery**: Unified feed of events.
- **Dynamic Modules**: Configurable event features.

## Status

- **Architecture**: Separated into Frontend and Backend.
- **Backend API**: Auth and Event endpoints implemented.
- **Frontend**: API Client configured. UI currently uses mock data (Ready for integration).
