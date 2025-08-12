# Telegram Bot Deployment Guide

## Droplet Information
- **IP Address**: 68.183.110.75
- **Droplet ID**: 512911216  
- **Size**: s-1vcpu-512mb-10gb ($4/month)
- **OS**: Ubuntu 24.04 LTS
- **Region**: NYC1

## Initial Setup

### 1. Access Your Droplet

Check your email for the root password from DigitalOcean, then:

```bash
ssh root@68.183.110.75
```

When prompted, enter the password from the email and set a new password.

### 2. Setup SSH Key (Recommended)

Add your SSH key to avoid password authentication:

```bash
mkdir -p ~/.ssh
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIC4SALVV+mXOGM7UE/o7HgdNkXS7b1xUHrHTY1DowEbj telegram-bot@crm-magic" >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### 3. Run Deployment Script

Option A: Download and run the deployment script
```bash
curl -O https://raw.githubusercontent.com/nick-the-dev/crm-magic/main/telegram-remote-control/deploy.sh
chmod +x deploy.sh
./deploy.sh
```

Option B: Manual deployment
```bash
# Update system
apt-get update && apt-get upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs git build-essential

# Install PM2 and Yarn
npm install -g pm2 yarn

# Clone repository
mkdir -p /var/app && cd /var/app
git clone https://github.com/nick-the-dev/crm-magic.git
cd crm-magic/telegram-remote-control

# Install dependencies and build
yarn install
yarn build
```

### 4. Configure Environment Variables

Copy the example environment file and edit it:

```bash
cp .env.example .env
nano .env
```

Required environment variables:
- `TELEGRAM_BOT_TOKEN`: Your bot token from @BotFather
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_KEY`: Your Supabase service role key
- `N8N_WEBHOOK_BASE`: Your n8n instance URL
- `MONDAY_API_TOKEN`: Your Monday.com API token (if using Monday.com features)

### 5. Start the Bot

```bash
# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup systemd -u root --hp /root
```

## Management Commands

### Check Status
```bash
pm2 status
pm2 info telegram-bot
```

### View Logs
```bash
pm2 logs telegram-bot
pm2 logs telegram-bot --lines 100
```

### Restart/Stop
```bash
pm2 restart telegram-bot
pm2 stop telegram-bot
pm2 start telegram-bot
```

### Update Deployment
```bash
cd /var/app/crm-magic
git pull
cd telegram-remote-control
yarn install
yarn build
pm2 restart telegram-bot
```

## Monitoring

### PM2 Monitoring
```bash
pm2 monit
```

### System Resources
```bash
htop
free -h
df -h
```

### Network
```bash
netstat -tlnp
ss -tlnp
```

## Troubleshooting

### Bot Not Starting
1. Check logs: `pm2 logs telegram-bot --lines 200`
2. Verify environment variables: `cat .env`
3. Test database connection: `node -e "console.log(process.env.SUPABASE_URL)"`
4. Check port availability: `lsof -i :1337`

### Out of Memory
The droplet has limited RAM (512MB). If you encounter memory issues:
1. Check memory usage: `free -h`
2. Restart the bot: `pm2 restart telegram-bot`
3. Consider upgrading to a larger droplet size

### Connection Issues
1. Check firewall rules: `ufw status`
2. Verify bot is running: `pm2 status`
3. Test webhook endpoints: `curl http://localhost:1337/health`

## Security Recommendations

1. **Setup UFW Firewall**:
```bash
ufw allow 22/tcp
ufw allow 1337/tcp
ufw enable
```

2. **Create Non-Root User**:
```bash
adduser botuser
usermod -aG sudo botuser
su - botuser
```

3. **Disable Root SSH** (after setting up user):
Edit `/etc/ssh/sshd_config`:
```
PermitRootLogin no
```

4. **Regular Updates**:
```bash
apt-get update && apt-get upgrade -y
```

## Backup Strategy

1. **Database**: Supabase handles automatic backups
2. **Configuration**: Keep `.env` file backed up securely
3. **Code**: Already in GitHub repository

## Scaling Options

If you need more resources:
1. Resize droplet: Use DigitalOcean control panel
2. Add swap space:
```bash
fallocate -l 1G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

## Support

- Bot Issues: Check GitHub repository issues
- DigitalOcean: support.digitalocean.com
- Logs Location: `/var/app/crm-magic/telegram-remote-control/logs/`