# Hygieia: Privacy-First Federated Learning for Healthcare

Hygieia is a cutting-edge federated learning system designed for hospitals, enabling collaborative AI model training while preserving patient privacy and data sovereignty.

## Tech Stack

- **Backend**: FastAPI + Python
- **Frontend**: React + TypeScript + TailwindCSS
- **Machine Learning**: PyTorch (coming in future phases)
- **Containerization**: Docker
- **Development Tools**: 
  - Node.js v18+
  - Python 3.9+
  - Docker Desktop

## Project Structure

```
hygieia/
├── server/        # FastAPI backend
├── client/        # Hospital client scripts
├── frontend/      # React dashboard
├── data/          # Synthetic datasets
├── docker/        # Docker & compose files
└── README.md
```

## Phase 0: Getting Started

### Prerequisites

1. Docker Desktop installed and running
2. Node.js v18 or higher
3. Python 3.9 or higher

### Running the Project

1. Clone the repository:
```bash
git clone [your-repo-url]
cd hygieia
```

2. Start the services:
```bash
cd docker
docker-compose up
```

3. Verify the setup:
- Backend API: http://localhost:8000/ping
- Frontend Dashboard: http://localhost:5173

### Test Data

The `/data` directory contains synthetic hospital datasets:
- `hospital_A.csv`: High ICU load scenario
- `hospital_B.csv`: Lower ICU load with staff shortage scenario

## License

MIT License
