# DevOps & Infrastructure Guide

This guide explains the infrastructure architecture implemented for CareerMap Solutions (CMS). It covers Containerization (Docker), Continuous Integration (CI/CD), and Process Management (PM2).

## 1. Containerization (Docker)

We use **Docker** to package the application and its dependencies into standardized units (containers). This ensures the app runs consistently across development, staging, and production environments.

### Architecture
-   **Client Container**: Served via Nginx (High performance Web Server).
    -   *Concept*: **Multi-Stage Build**. We use a Node.js image to *build* the React app, then copy only the static artifacts (`dist/`) to a lightweight Nginx image. This reduces image size from >1GB to <50MB.
-   **Server Container**: Node.js API.
    -   *Concept*: **Production Optimization**. We default `NODE_ENV` to `production` and install only `dependencies` (skipping `devDependencies`), keeping the image secure and small.
-   **Database**: MongoDB (via official image).

### Files
-   `Server/Dockerfile`: Instructions to build the API image.
-   `Client/Dockerfile`: Instructions to build the Frontend image + Nginx config.
-   `docker-compose.yml`: Orchestrator that creates a network connecting Client, Server, and DB.

### Usage
```bash
# Start all services
docker-compose up --build

# Stop all services
docker-compose down
```

---

## 2. CI/CD Pipeline (GitHub Actions)

We use **GitHub Actions** to automate our testing and delivery pipeline. This ensures that no broken code is merged into the main branch.

### Workflow: `ci.yml`
Triggered on every `push` or `pull_request` to `main`.

1.  **Checkout**: Pulls the latest code.
2.  **Linting**: Runs `npm run lint` to catch syntax/style errors.
3.  **Testing**: Runs `npm test` (Integration Tests) to verify business logic.
4.  **Build Verification**: Attempts to build the Docker images to ensure the build process is valid.

---

## 3. Process Management (PM2)

For traditional (non-Docker) VPS deployments, we use **PM2**. It is a production process manager for Node.js.

### Benefits
-   **Cluster Mode**: Utilizes all available CPU cores to handle traffic.
-   **Auto-Restart**: Automatically restarts the app if it crashes.
-   **Zero-Downtime Reload**: Updates the app without dropping active connections.

### Usage
```bash
# Start Server in Production
cd Server
pm2 start ecosystem.config.cjs

# Monitor Logs
pm2 monit
```

---

## 4. AWS Deployment (Docker)

To switch your AWS server from the legacy (manual) deployment to the new Docker system, follow these steps.

### Prerequisites on AWS
-   **Docker installed**: `sudo apt install docker.io`
-   **Docker Compose installed**: `sudo apt install docker-compose`
-   **User Permissions**: `sudo usermod -aG docker ubuntu` (then logout and login)

### Migration Steps
Since you are currently running Nginx on the host (Port 80) and PM2 (Port 5000), you must stop them so Docker containers can bind to those ports.

1.  **Transfer the Script**:
    Copy `deploy-docker.sh` to your server (or pull it via git).

2.  **Make Executable**:
    ```bash
    chmod +x deploy-docker.sh
    ```

3.  **Run Deployment**:
    ```bash
    ./deploy-docker.sh
    ```
    *This script automatically stops your old Nginx/PM2 services and starts the Docker stack.*

4.  **Verify**:
    Run `docker ps` to see your running containers (`cms-client`, `cms-server`, `cms-mongo`).

### Managing Updates
Whenever you push changes to GitHub, simply run `./deploy-docker.sh` on the server again. It will pull the latest code, rebuild the images, and restart the containers with zero downtime (Client side).

---

## 5. Automated Deployment (CD Pipeline)

We have configured `.github/workflows/cd.yml` to automatically deploy changes to AWS whenever the CI pipeline passes on the `main` branch.

### Required GitHub Secrets
To enable this, you must go to your GitHub Repository -> **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret** and add the following:

| Secret Name | Value Example | Description |
| :--- | :--- | :--- |
| `AWS_HOST` | `13.55.xx.xx` | Your AWS Server's Public IP. |
| `AWS_USER` | `ubuntu` | The user you login as (usually `ubuntu` for AWS EC2). |
| `AWS_SSH_KEY` | `-----BEGIN RSA PRIVATE KEY----- ...` | The content of your private key (See below if you don't have one). |

### How to get `AWS_SSH_KEY` if you use AWS Console (No .pem file)
If you login via the browser and don't have a specific key file, you can generate a specific one for GitHub to use:

1.  **Run on your AWS Server**:
    ```bash
    # Generate a new key pair (press Enter for no passphrase)
    ssh-keygen -t rsa -b 4096 -f ~/.ssh/github_action_key -N ""

    # Authorize the new key
    cat ~/.ssh/github_action_key.pub >> ~/.ssh/authorized_keys
    ```

2.  **View the Private Key**:
    ```bash
    cat ~/.ssh/github_action_key
    ```

3.  **Copy**: Copy the entire output (including `BEGIN` and `END` lines) and paste it into the **`AWS_SSH_KEY`** secret in GitHub.



