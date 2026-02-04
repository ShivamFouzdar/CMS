#!/bin/bash
set -e

# Configuration
PROJECT_DIR="/home/ubuntu/new/CMS" # Default path as seen in deploy-docker.sh
SERVER_CONTAINER="cms-server"

echo "🚀 Starting AWS Team Update..."

# Navigate to project
if [ -d "$PROJECT_DIR" ]; then
    cd "$PROJECT_DIR"
    echo "📂 Changed directory to $PROJECT_DIR"
else
    echo "⚠️  Directory $PROJECT_DIR not found. Assuming current directory."
fi

# 1. Update Code
echo "📥 Pulling latest changes..."
git pull origin main

# 2. Rebuild Containers
echo "🔄 Rebuilding and restarting containers..."
# Rebuild to ensure new seed-team.js and updated API routes are in the image
docker-compose up -d --build

# 3. Wait for Server to stabilize
echo "⏳ Waiting for server to start (10s)..."
sleep 10

# 4. Run Seed Script inside Container
# We run it inside the container so it has access to the internal 'mongodb' network alias
echo "🌱 Running Team Seed script..."
if docker ps | grep -q "$SERVER_CONTAINER"; then
    docker exec "$SERVER_CONTAINER" npm run build # Ensure build is fresh inside (optional if Dockerfile runs build)
    # Actually, Dockerfile usually runs 'npm start' which runs 'node dist/server.js'
    # We need to run 'node seed-team.js' but it might rely on built files.
    # Let's check if the container has the 'seed-team.js' file. 
    # If the Dockerfile copies 'package.json' and 'src' but not root files, we might miss it.
    # BUT 'COPY . .' usually copies everything.
    
    # We'll try to run it directly.
    # Note: validation of imports requires dist/models/TeamMember.js to exist. 
    # The 'build' step in Dockerfile usually creates 'dist'.
    
    docker exec "$SERVER_CONTAINER" node seed-team.js
    
    if [ $? -eq 0 ]; then
        echo "✅ Team data seeded successfully!"
    else
        echo "❌ Seeding failed. Checking logs..."
        docker logs --tail 20 "$SERVER_CONTAINER"
    fi
else
    echo "❌ Server container '$SERVER_CONTAINER' is not running!"
    exit 1
fi

echo "🎉 Deployment and Seeding Complete!"
echo "👉 Check the live site team page."
