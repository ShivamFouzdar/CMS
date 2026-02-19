#!/bin/bash
set -e

# Fix for older docker-compose (v1.29) compatibility
export DOCKER_BUILDKIT=0
export COMPOSE_DOCKER_CLI_BUILD=0

echo "🐳 Starting CMS Docker deployment..."

# ===== CONFIG =====
PROJECT_DIR="/home/ubuntu/new/CMS"
REPO_URL="https://github.com/ShivamFouzdar/CMS.git"

# ===== CHECK TOOLS =====
command -v git >/dev/null || { echo "❌ Git not installed"; exit 1; }
command -v docker >/dev/null || { echo "❌ Docker not installed"; exit 1; }
command -v docker-compose >/dev/null || { echo "❌ Docker Compose not installed"; exit 1; }

# ===== UPDATE CODE =====
echo "📥 Updating code from GitHub..."
if [ ! -d "$PROJECT_DIR/.git" ]; then
    echo "📁 Project not found. Cloning fresh..."
    git clone "$REPO_URL" "$PROJECT_DIR"
else
    cd "$PROJECT_DIR"
    git fetch origin
    git reset --hard origin/main
    git clean -fd
fi

# ===== PREPARE ENVIRONMENT =====
# Ensure .env exists in Server directory (it should be manually placed there once)
if [ ! -f "$PROJECT_DIR/Server/.env" ]; then
    echo "⚠️  WARNING: Server/.env not found at $PROJECT_DIR/Server/.env! Application may fail to start."
fi

# ===== STOP LEGACY SERVICES (MIGRATION) =====
echo "🛑 Stopping legacy services to free up ports..."
# Stop PM2 if running (frees up port 5000 if using host networking, though docker uses internal network)
if command -v pm2 >/dev/null; then
    pm2 stop cms || true
    echo "   - PM2 'cms' stopped."
fi

# Note: We keeps Host Nginx RUNNING to handle SSL.
# Docker will run on internal ports (Client:3000, Server:5000)
# Nginx will reverse-proxy to them.

# ===== DOCKER DEPLOY =====
echo "🚀 Building and Starting Containers..."
cd "$PROJECT_DIR"

# Stop existing containers
docker-compose down 

# Start new containers
# --build ensures we rebuild images with latest code
docker-compose up -d --build

echo "🧹 Cleaning up unused images..."
docker image prune -f

echo "🎉 CMS Docker Deployment Completed Successfully!"
echo "   - Client: http://<your-ip>"
echo "   - Server: http://<your-ip>:5000"
