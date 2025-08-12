#!/bin/bash

# Telegram Bot Deployment Script for DigitalOcean
# Run this script on your droplet after SSH access is configured

set -e

echo "🚀 Starting Telegram Bot Deployment..."

# Update system
echo "📦 Updating system packages..."
apt-get update
apt-get upgrade -y

# Install Node.js 20.x
echo "🟢 Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install additional dependencies
echo "📚 Installing build tools and git..."
apt-get install -y git build-essential

# Install global npm packages
echo "🌍 Installing PM2 and Yarn..."
npm install -g pm2 yarn

# Create app directory
echo "📁 Creating application directory..."
mkdir -p /var/app
cd /var/app

# Clone the repository
echo "🔽 Cloning repository..."
if [ -d "crm-magic" ]; then
    echo "Repository already exists, pulling latest changes..."
    cd crm-magic
    git pull
else
    git clone https://github.com/nick-the-dev/crm-magic.git
    cd crm-magic
fi

# Navigate to bot directory
cd telegram-remote-control

# Install dependencies
echo "📦 Installing dependencies..."
yarn install

# Build the application
echo "🔨 Building application..."
yarn build

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "Please create .env file with the following variables:"
    echo ""
    cat .env.example
    echo ""
    echo "Create the file at: /var/app/crm-magic/telegram-remote-control/.env"
    echo "Then run: pm2 start ecosystem.config.js"
    exit 1
fi

# Start with PM2
echo "🎯 Starting bot with PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root

echo "✅ Deployment complete!"
echo ""
echo "📊 Check status with: pm2 status"
echo "📝 View logs with: pm2 logs telegram-bot"
echo "🔄 Restart with: pm2 restart telegram-bot"
echo ""
echo "🌐 Droplet IP: $(curl -s ifconfig.me)"