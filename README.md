# Monday.com AI Tasks Generator

Automatically generate realistic project tasks with AI and add them to Monday.com boards with intelligent user assignment and location-based task distribution. Includes n8n workflow automation and Telegram bot for remote control.

## 🚀 Quick Start

```javascript
mcp__n8n-mcp__n8n_trigger_webhook_workflow({
  webhookUrl: "https://automations-n8n.u841sv.easypanel.host/webhook/monday-tasks",
  httpMethod: "POST",
  data: {
    projectDescription: "Build an AI-powered customer feedback analysis system",
    boardId: "9744010967",
    assigneeEmails: "gluknik+1@gmail.com",
    provinces: "Ontario"  // Optional: assigns cities from Ontario
  },
  waitForResponse: true
})
```

## ✨ Features

- **AI-Powered**: Generates 3-5 realistic tasks per sprint (38-42 weekly hours)
- **Smart Scheduling**: Single-day tasks with varied start times (6-10 AM EST)
- **User Assignment**: Automatic email-based Monday.com user lookup
- **Location Distribution**: Assigns cities from specified provinces
- **Rich Data**: Priority levels, dollar amounts ($500-800), time estimates
- **Flexible Groups**: Creates new groups or uses existing ones

## 📁 Project Structure

```
crm-magic/
├── .claude/                    # Claude Code configuration
│   ├── commands/               # Custom slash commands
│   └── n8n_workflow_instructions.md
├── docs/                       
│   └── TESTING.md             # Consolidated testing guide
├── workflows/                  
│   └── monday-tasks-generator-enhanced.json
├── telegram-remote-control/   # Telegram bot for remote control
│   ├── src/                   # Bot source code
│   ├── scripts/               # Management scripts
│   └── README.md              # Bot documentation
├── index.html                 # Web form interface
├── README.md                  # This file
└── CLAUDE.md                  # Claude Code instructions
```

## 🔧 Configuration

| Environment | Value |
|-------------|-------|
| n8n Instance | `https://automations-n8n.u841sv.easypanel.host` |
| Webhook URL | `/webhook/monday-tasks` |
| Workflow ID | `ixbSnRIIcxZnJVjR` |
| Test Board | `9744010967` |

## 📚 Documentation

- **Testing Guide**: [`docs/TESTING.md`](docs/TESTING.md)
- **Claude Instructions**: [`CLAUDE.md`](CLAUDE.md)
- **Workflow File**: [`workflows/monday-tasks-generator-enhanced.json`](workflows/monday-tasks-generator-enhanced.json)

## 🎯 Input Parameters

| Field | Required | Description |
|-------|----------|-------------|
| projectDescription | Yes | Detailed project description (min 10 chars) |
| boardId | Yes | Monday.com board ID |
| assigneeEmails | No | Comma-separated email addresses |
| weeklyHours | No | Total weekly hours (20-60, default 40) |
| provinces | No | Canadian provinces for city assignment |
| groupId | No | Existing group ID |
| groupName | No | Custom group name |

## 🤖 Telegram Bot

The project includes a Telegram bot for remote task generation:
- **Bot Username**: @CRMTaskGeneratorBot
- **Commands**: `/tasks` - Interactive task creation workflow
- **Authentication**: Password-protected with 30-day sessions
- **Deployment**: DigitalOcean App Platform (auto-deploy on push)

## 🚢 Deployment

### Telegram Bot (DigitalOcean App Platform)
- **App Name**: telegram-crm-bot
- **Region**: NYC
- **URL**: https://telegram-crm-bot-pfyvn.ondigitalocean.app
- **Auto-deploy**: Enabled (deploys on push to main branch)
- **Build**: Yarn 4.2.2 with TypeScript compilation
- **Runtime**: Node.js 22.x

### n8n Workflow
- **Instance**: https://automations-n8n.u841sv.easypanel.host
- **Workflow ID**: ixbSnRIIcxZnJVjR
- **Webhook**: `/webhook/monday-tasks`

## ✅ Production Ready

Successfully tested with:
- OpenRouter AI (Gemini 2.5 Flash)
- Monday.com API v2
- Email-based user assignment
- Province-based city distribution
- Full column mapping (priority, dates, amount, area)
- Telegram bot with detailed task confirmation
- DigitalOcean App Platform deployment

---
*Last Updated: 2025-08-12*