#!/bin/bash

# Deployment script for Telegram bot on DigitalOcean
# Usage: 
#   ./deploy-bot.sh          # Update existing deployment
#   ./deploy-bot.sh setup    # Initial server setup

DROPLET_IP="178.128.154.94"
APP_DIR="/var/app/crm-magic"

if [ "$1" == "setup" ]; then
    echo "🔧 Setting up new server..."
    echo "📍 Target: $DROPLET_IP"
    
    ssh root@$DROPLET_IP << 'ENDSSH'
echo "📦 Installing Node.js and dependencies..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs git
npm install -g yarn pm2

echo "📂 Creating app directory..."
mkdir -p /var/app
cd /var/app

echo "📥 Cloning repository..."
git clone https://github.com/nick-the-dev/crm-magic.git
cd crm-magic/telegram-remote-control

echo "📦 Installing dependencies..."
yarn install

echo "🔨 Building application..."
yarn build

echo "⚙️ Setting up PM2..."
pm2 startup systemd -u root --hp /root
pm2 save

echo "⚠️  IMPORTANT: Configure /var/app/crm-magic/telegram-remote-control/.env"
echo "Then run: pm2 start dist/server.js --name telegram-bot"
ENDSSH
    
else
    echo "🚀 Deploying updates to DigitalOcean..."
    echo "📍 Target: $DROPLET_IP"
    
    ssh root@$DROPLET_IP << 'ENDSSH'
echo "📂 Navigating to app directory..."
cd /var/app/crm-magic

echo "📥 Pulling latest changes from GitHub..."
git pull

echo "📦 Building Telegram bot..."
cd telegram-remote-control
yarn build

echo "🔄 Restarting bot with PM2..."
pm2 restart telegram-bot

echo "✅ Checking bot status..."
pm2 status telegram-bot

echo "📊 Bot logs (last 20 lines):"
pm2 logs telegram-bot --lines 20 --nostream

echo "✅ Deployment complete!"
ENDSSH
fi

echo "✨ Done!"