# AWS Deployment Guide - Purdue ECE Planner

This guide walks you through deploying the Purdue ECE Planner to AWS using EC2.

## Architecture

- **EC2**: Runs the Next.js application in Docker
- **PostgreSQL**: Runs alongside the app in Docker (can be upgraded to RDS)
- **S3**: (Optional) For storing static assets
- **Lambda**: (Optional) For background processing tasks

## Prerequisites

1. AWS Account
2. AWS CLI installed and configured
3. A domain name (optional, but recommended)

## Step 1: Set Up AWS CLI

```bash
# Install AWS CLI (macOS)
brew install awscli

# Configure with your credentials
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter default region (e.g., us-east-1)
# Enter default output format (json)
```

## Step 2: Create EC2 Instance

### Option A: Using AWS Console

1. Go to EC2 Dashboard → Launch Instance
2. Choose settings:
   - **Name**: purdue-ece-planner
   - **AMI**: Amazon Linux 2023
   - **Instance type**: t2.small (or t2.micro for free tier)
   - **Key pair**: Create new or use existing
   - **Security group**: Create new with these rules:
     - SSH (22) from your IP
     - HTTP (80) from anywhere
     - HTTPS (443) from anywhere

### Option B: Using AWS CLI

```bash
# Create security group
aws ec2 create-security-group \
  --group-name ece-planner-sg \
  --description "Security group for ECE Planner"

# Get the security group ID from output, then add rules
aws ec2 authorize-security-group-ingress \
  --group-id <sg-id> \
  --protocol tcp \
  --port 22 \
  --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-id <sg-id> \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

# Create key pair
aws ec2 create-key-pair \
  --key-name ece-planner-key \
  --query 'KeyMaterial' \
  --output text > ece-planner-key.pem

chmod 400 ece-planner-key.pem

# Launch instance
aws ec2 run-instances \
  --image-id ami-0c7217cdde317cfec \
  --instance-type t2.small \
  --key-name ece-planner-key \
  --security-group-ids <sg-id> \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=purdue-ece-planner}]'
```

## Step 3: Connect to EC2

```bash
# Get public IP from AWS Console or CLI
aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=purdue-ece-planner" \
  --query 'Reservations[0].Instances[0].PublicIpAddress'

# Connect via SSH
ssh -i ece-planner-key.pem ec2-user@<public-ip>
```

## Step 4: Set Up the Server

Run these commands on your EC2 instance:

```bash
# Update system
sudo yum update -y

# Install Docker
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
sudo yum install -y git

# Log out and back in for docker group to take effect
exit
```

## Step 5: Deploy the Application

```bash
# SSH back in
ssh -i ece-planner-key.pem ec2-user@<public-ip>

# Clone your repository (or use your own repo URL)
git clone https://github.com/<your-username>/purdue-ece-planner.git
cd purdue-ece-planner

# Create production environment file
cat > .env << 'EOF'
# Database (internal Docker network)
DATABASE_URL="postgresql://postgres:your-secure-password-here@postgres:5432/ece_planner?schema=public"
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-password-here
POSTGRES_DB=ece_planner

# NextAuth - CHANGE THIS!
NEXTAUTH_URL="http://<your-ec2-public-ip>"
NEXTAUTH_SECRET="generate-a-random-32-char-string-here"

# OAuth (optional - get from Google/GitHub developer consoles)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_ID=""
GITHUB_SECRET=""

# OpenAI
OPENAI_API_KEY="your-openai-key"
EOF

# Edit the .env file with your actual values
nano .env

# Build and start the application
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for containers to be healthy, then set up database
sleep 30
docker-compose -f docker-compose.prod.yml exec app npx prisma db push
docker-compose -f docker-compose.prod.yml exec app npx prisma db seed
```

## Step 6: Verify Deployment

Open your browser and go to: `http://<your-ec2-public-ip>`

## Optional: Set Up Domain with Route 53

1. Register or transfer domain to Route 53
2. Create hosted zone
3. Add A record pointing to EC2 public IP
4. Update NEXTAUTH_URL in .env

## Optional: Set Up HTTPS with Let's Encrypt

```bash
# Install certbot
sudo yum install -y certbot

# Stop the app temporarily
docker-compose -f docker-compose.prod.yml down

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com

# Update docker-compose.prod.yml to use HTTPS (port 443)
# Then restart
docker-compose -f docker-compose.prod.yml up -d
```

## Useful Commands

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart app
docker-compose -f docker-compose.prod.yml restart

# Stop app
docker-compose -f docker-compose.prod.yml down

# Rebuild after code changes
git pull
docker-compose -f docker-compose.prod.yml up -d --build
```

## Cost Estimate

- **t2.micro** (free tier eligible): ~$0/month for first year, then ~$8.50/month
- **t2.small**: ~$17/month
- **Domain** (optional): ~$12/year for .com

## Troubleshooting

### App not accessible
- Check security group allows port 80
- Check docker containers are running: `docker ps`
- Check logs: `docker-compose -f docker-compose.prod.yml logs`

### Database connection issues
- Ensure postgres container is healthy: `docker ps`
- Check DATABASE_URL uses `postgres` (container name) not `localhost`

### OAuth not working
- Ensure NEXTAUTH_URL matches your actual URL
- Update OAuth app settings in Google/GitHub to use new URL
