# Telegram Remote Control Bot

A Telegram bot that acts as a remote control for n8n workflows and other applications, featuring conversational commands and secure authentication.

## Features

- 🔐 **Secure Authentication**: Password-based authentication with 30-day session persistence
- 💬 **Conversational Interface**: Step-by-step guided flows for complex commands
- 🚀 **n8n Integration**: Trigger workflows directly from Telegram
- 📊 **Monday.com Tasks**: Create tasks with AI-powered generation
- 🔌 **Extensible**: Easy to add new app integrations
- 📝 **Command Logging**: Track all bot interactions

## Setup

### 1. Prerequisites

- Node.js 18+ and Yarn
- Telegram Bot (create via [@BotFather](https://t.me/botfather))
- Supabase project
- n8n instance (for workflow integration)

### 2. Installation

```bash
# Clone and navigate to the project
cd telegram-remote-control

# Install dependencies
yarn install

# Copy environment template
cp .env.example .env
```

### 3. Environment Configuration

Edit `.env` with your credentials:

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather

# Supabase
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key

# n8n Integration
N8N_WEBHOOK_BASE=https://your-n8n-instance.com

# Monday.com (optional)
MONDAY_API_TOKEN=your_monday_token
MONDAY_DEFAULT_BOARD_ID=9744010967

# Security
JWT_SECRET=generate_random_string_here
SESSION_DURATION_DAYS=30
```

### 4. Database Setup

The database tables are automatically created on first run. Tables include:
- `telegram_users` - Authorized users
- `telegram_sessions` - Active sessions
- `command_states` - Multi-step conversation tracking
- `command_logs` - Command history
- `app_integrations` - Webhook configurations

### 5. Add Users

Users must be manually added for security:

```bash
# Add a user
yarn add-user <telegram_id> <username> <password>

# Example
yarn add-user 123456789 "Nick" "SecurePassword123!"
```

To find your Telegram ID:
1. Message [@userinfobot](https://t.me/userinfobot)
2. It will reply with your user ID

### 6. Add Integrations (Optional)

```bash
# Add a webhook integration
yarn add-integration <name> <webhook_url> [config_json]

# Example
yarn add-integration "deploy-api" "https://api.example.com/deploy" '{"key": "value"}'
```

### 7. Start the Bot

```bash
# Development mode
yarn start

# Production mode
yarn build && yarn distribute
```

## Usage

### First Time Authentication

When you first message the bot:
1. Send any command (e.g., `/help`)
2. Bot will ask for your password
3. Enter the password you set when adding your user
4. You're authenticated for 30 days

### Available Commands

#### `/tasks` - Create Monday.com Tasks
Interactive flow that asks for:
- Project description
- Board ID (optional)
- Group name (optional)
- Assignee emails (optional)
- Weekly hours (20-60)
- Provinces/areas for distribution (optional)

#### `/status` - System Status
Shows:
- Database connection status
- n8n availability
- Recent commands
- Last task creation details

#### `/webhook [name]` - Trigger Webhooks
- Without arguments: Lists available webhooks
- With name: Triggers the specified webhook

#### `/deploy` - Deployment Control
(Coming soon - placeholder for deployment integrations)

#### `/help` - Help Menu
Shows all available commands and usage tips

### Conversation Tips

- Type `skip` to skip optional fields
- Type `cancel` to stop any conversation
- Sessions stay active for 30 days
- All commands are logged for security

## Security

- Users must be manually added (no self-registration)
- Password authentication on first use
- 30-day session persistence
- All commands are logged
- Rate limiting per user
- Telegram ID whitelist

## Troubleshooting

### Bot not responding
- Check bot token is correct
- Ensure bot is not already running elsewhere
- Check Supabase connection

### Authentication issues
- Verify user was added correctly
- Check password is correct
- Look for session in database

### Webhook failures
- Verify webhook URL is accessible
- Check n8n instance is running
- Review command logs in Supabase

## License

MIT
