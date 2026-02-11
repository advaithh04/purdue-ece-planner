#!/bin/bash

# AWS EC2 Deployment Script for Purdue ECE Planner
# This script sets up the application on a fresh EC2 instance

set -e

echo "=========================================="
echo "Purdue ECE Planner - AWS EC2 Deployment"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
  echo -e "${YELLOW}Please run with sudo${NC}"
  exit 1
fi

echo -e "${GREEN}[1/6] Updating system packages...${NC}"
yum update -y

echo -e "${GREEN}[2/6] Installing Docker...${NC}"
yum install -y docker
systemctl start docker
systemctl enable docker

echo -e "${GREEN}[3/6] Installing Docker Compose...${NC}"
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

echo -e "${GREEN}[4/6] Adding ec2-user to docker group...${NC}"
usermod -aG docker ec2-user

echo -e "${GREEN}[5/6] Installing Git...${NC}"
yum install -y git

echo -e "${GREEN}[6/6] Setup complete!${NC}"
echo ""
echo "=========================================="
echo "Next steps:"
echo "=========================================="
echo "1. Log out and log back in (for docker group to take effect)"
echo "2. Clone your repository:"
echo "   git clone <your-repo-url> /home/ec2-user/purdue-ece-planner"
echo ""
echo "3. Create .env file with production values:"
echo "   cd /home/ec2-user/purdue-ece-planner"
echo "   cp .env.example .env"
echo "   nano .env  # Edit with production values"
echo ""
echo "4. Start the application:"
echo "   docker-compose -f docker-compose.prod.yml up -d --build"
echo ""
echo "5. Initialize the database:"
echo "   docker-compose -f docker-compose.prod.yml exec app npx prisma db push"
echo "   docker-compose -f docker-compose.prod.yml exec app npx tsx scripts/seed.ts"
echo ""
echo "Your app will be available at http://<your-ec2-public-ip>"
echo "=========================================="
