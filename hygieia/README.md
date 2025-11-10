# Federated Healthcare Intelligence

## Overview
The current project snapshot provides a lightweight scaffold for the upcoming Federated Healthcare Intelligence platform. It ships with a Docker-based development environment, a minimal FastAPI backend prepared for a MySQL connection, and a React landing page that announces the product launch.

## Project Structure
```
hygieia/
├── data/          # Local datasets and seed files for development
├── docker/        # Docker Compose definition
├── frontend/      # React "Coming Soon" landing page
├── server/        # FastAPI service with MySQL-ready scaffolding
└── README.md
```

## Prerequisites
- **Docker Desktop**: Includes Docker Compose V2 support.
- **MySQL instance**: Running on your host machine (or reachable network location).

## Environment Configuration
Create a `.env` file inside `server/` to supply the FastAPI service with database credentials.

```
MYSQL_HOST=host.docker.internal
MYSQL_PORT=3306
MYSQL_USER=<your-user>
MYSQL_PASSWORD=<your-password>
MYSQL_DATABASE=fhi
```

- **MYSQL_HOST**: Use `host.docker.internal` to reach a database running on the host (adjust if you host MySQL elsewhere).
- **MYSQL_PORT**: Defaults to `3306`, change if your instance runs on an alternate port.
- **MYSQL_DATABASE**: The database that the service will connect to; create it ahead of time if needed.

## Running the Stack
1. **Open PowerShell** and switch to the project directory:
   ```powershell
   Set-Location "d:\.vscode\Federated-HealthCare-Intelligence\hygieia\docker"
   ```
2. **Launch the containers** (first run will build the images):
   ```powershell
   docker compose up --build
   ```
3. **Verify the services**:
   - **API health check**: `http://localhost:8000/health`
   - **Landing page**: `http://localhost:5173` – displays “Federated Healthcare Intelligence — Coming Soon”.

Press `Ctrl+C` in the terminal to stop the stack when finished.

## Next Steps
- **Database migrations**: Introduce tooling such as Alembic once the schema is defined.
- **API expansion**: Implement domain endpoints as feature work begins.
- **UI development**: Extend the React app beyond the placeholder content.