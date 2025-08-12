# Claude Code Project Configuration

## Project Overview
This is a Monday.com CRM automation project that uses n8n workflows to generate and manage tasks with AI-powered task creation.

## Project Structure
```
crm-magic/
├── .claude/                    # Claude Code configuration
│   ├── commands/               # Custom slash commands
│   └── n8n_workflow_instructions.md
├── docs/                       
│   └── TESTING.md             # Consolidated testing guide
├── workflows/                  # n8n workflow files
│   └── monday-tasks-generator-enhanced.json
├── telegram-remote-control/   # Telegram bot for remote control
│   ├── src/
│   │   ├── bot/              # Bot commands and middleware
│   │   ├── helpers/          # Supabase and env config
│   │   └── server.ts         # Main entry point
│   ├── scripts/              # User and integration management
│   └── README.md             # Bot documentation
├── index.html                 # Web form interface
├── README.md                  # Project overview
└── CLAUDE.md                  # This file - Claude instructions
```

## Key Commands & Scripts

### Testing the Workflow
```javascript
// Quick test command - use this to verify workflow is working
mcp__n8n-mcp__n8n_trigger_webhook_workflow({
  webhookUrl: "https://automations-n8n.u841sv.easypanel.host/webhook/monday-tasks",
  httpMethod: "POST",
  data: {
    projectDescription: "Build an AI-powered customer feedback analysis system",
    boardId: "9744010967",
    assigneeEmails: "gluknik+1@gmail.com",
    weeklyHours: 40  // Optional: 20-60 hours, defaults to 40
  },
  waitForResponse: true
})
```

### Environment Details
- **n8n Instance**: `https://automations-n8n.u841sv.easypanel.host`
- **Workflow ID**: `ixbSnRIIcxZnJVjR`
- **Workflow Name**: `Monday.com AI Tasks Generator - Enhanced v2`
- **Monday Board ID**: `9744010967`
- **Test Email**: `gluknik+1@gmail.com`

## CRITICAL: ACTUAL TESTING PROTOCOL (LEARNED FROM FAILURE)

### ⚠️ When User Says "Fix This" - VERIFY IT ACTUALLY WORKS
1. **Deploy to n8n** - Update the workflow with full update
2. **Test with real data** - Run the webhook test command
3. **CHECK MONDAY.COM DIRECTLY** - Count tasks, verify owners assigned
4. **Check execution logs** - Look for specific error messages (⚠️ see token limit warning below)
5. **Only claim success when proven** - User frustration is justified if you don't verify

### ⚠️ CRITICAL: n8n Execution Data Token Limit
**NEVER** use `includeData: true` when calling `n8n_list_executions` - it will exceed token limits!
```javascript
// ❌ WRONG - Will exceed token limits
mcp__n8n-mcp__n8n_list_executions({ workflowId: "some-id", limit: 1, includeData: true })

// ✅ CORRECT - Safe to use
mcp__n8n-mcp__n8n_list_executions({ workflowId: "some-id", limit: 1, includeData: false })
```

### The Test Command That ACTUALLY Works
```javascript
mcp__n8n-mcp__n8n_trigger_webhook_workflow({
  webhookUrl: "https://automations-n8n.u841sv.easypanel.host/webhook/monday-tasks",
  httpMethod: "POST",
  data: {
    projectDescription: "Build an AI-powered customer feedback analysis system",
    boardId: "9744010967",
    assigneeEmails: "gluknik+1@gmail.com",
    weeklyHours: 40  // Optional: 20-60 hours, defaults to 40
  },
  waitForResponse: true
})
```

### Verification Checklist (DO ALL OF THESE)
- [ ] Workflow returns `{"success": true, "tasksCreated": 3-5}`
- [ ] Check Monday.com board 9744010967 for new tasks
- [ ] Verify "Nick T" appears in Owner column for all tasks
- [ ] Confirm group was created (check group name)
- [ ] Check priority, hours, description, amount, area are populated

### Common Pitfall: Escaped Quotes in Code Nodes
Watch for `\"person\"` vs `"person"` in JavaScript within JSON. This single issue blocked task creation for multiple attempts.

## Best Practices & Instructions

### 1. Code Style & Conventions
- **No Comments**: Do not add comments to code unless explicitly requested
- **Follow Existing Patterns**: Always check existing code style before making changes
- **Use Existing Libraries**: Never assume a library is available - check package.json or similar first
- **Preserve Formatting**: Maintain exact indentation when editing files

### 2. Documentation Guidelines
- **Never Create Docs Proactively**: Only create documentation files when explicitly requested
- **Prefer Editing**: Always edit existing files rather than creating new ones
- **Keep It Concise**: Documentation should be clear and to-the-point

### 3. Testing Protocol
- **Always Run Tests**: After making changes, run appropriate test commands
- **Verify Changes**: Use the quick test command above to verify workflow functionality
- **Check Validation**: Run `mcp__n8n-mcp__n8n_validate_workflow()` before deploying changes

### 4. Git Workflow
- **Never Auto-Commit**: Only commit when explicitly asked by the user
- **Clear Commit Messages**: Use descriptive commit messages that explain the "why"
- **Review Before Commit**: Always show what will be committed before executing

### 5. n8n Workflow Development
- **Validate First**: Always validate workflows before updates
- **Use Partial Updates**: For small changes, use partial updates instead of full workflow updates
- **Include Settings**: Always include `settings: { executionOrder: "v1" }` in workflow updates
- **Test After Changes**: Immediately test after any workflow modification

### 6. Monday.com Integration
- **Use GraphQL for Complex Queries**: Leverage the GraphQL API for advanced operations
- **Validate Board Access**: Always verify board ID exists and is accessible
- **Handle User Lookup**: Use email-based user lookup for task assignments
- **Check Column Mapping**: Verify column IDs match the actual board structure

### 7. Error Handling
- **Log Errors Clearly**: Use structured logging for debugging
- **Implement Fallbacks**: Always have fallback logic for external API calls
- **Validate Input**: Check all required fields before processing
- **Return Meaningful Errors**: Provide actionable error messages

### 8. Performance Optimization
- **Batch Operations**: Use parallel processing where possible
- **Limit API Calls**: Minimize external API requests
- **Cache When Possible**: Store frequently used data
- **Monitor Execution Time**: Track and optimize slow operations

## MCP Tools Usage

**Note**: For detailed n8n workflow development instructions, see `.claude/n8n_workflow_instructions.md`

### Essential n8n MCP Commands
```javascript
// List workflows
mcp__n8n-mcp__n8n_list_workflows({ limit: 50 })

// Get workflow details
mcp__n8n-mcp__n8n_get_workflow_details({ id: "ixbSnRIIcxZnJVjR" })

// Validate workflow
mcp__n8n-mcp__n8n_validate_workflow({ id: "ixbSnRIIcxZnJVjR" })

// Check executions (⚠️ NEVER use includeData: true - exceeds token limits!)
mcp__n8n-mcp__n8n_list_executions({
  workflowId: "ixbSnRIIcxZnJVjR",
  limit: 10,
  includeData: false  // ⚠️ CRITICAL: Must be false to avoid token limit errors
})

// Update workflow in n8n (after local file changes)
mcp__n8n-mcp__n8n_update_full_workflow({
  id: "ixbSnRIIcxZnJVjR",
  // ... workflow definition from local file
})
```

### Monday.com MCP Commands
```javascript
// Get board schema
mcp__monday-api-mcp__get_board_schema({ boardId: 9744010967 })

// Create item
mcp__monday-api-mcp__create_item({
  boardId: 9744010967,
  name: "Task name",
  columnValues: "{}"
})

// List workspaces
mcp__monday-api-mcp__list_workspaces()
```

### GitHub Tools
**Available**: GitHub CLI (`gh`) and GitHub MCP server for comprehensive GitHub operations

#### GitHub CLI (gh)
- Available via Bash tool for repository management, pull requests, issues, etc.
- Example: `gh pr create`, `gh issue list`, `gh repo clone`

#### GitHub MCP Commands
```javascript
// Repository operations
mcp__github__create_repository({ name: "repo-name", private: false })
mcp__github__fork_repository({ owner: "owner", repo: "repo" })
mcp__github__create_branch({ owner: "owner", repo: "repo", branch: "new-branch" })

// Pull requests
mcp__github__create_pull_request({ 
  owner: "owner", 
  repo: "repo", 
  title: "PR title",
  head: "feature-branch",
  base: "main"
})
mcp__github__list_pull_requests({ owner: "owner", repo: "repo", state: "open" })
mcp__github__merge_pull_request({ owner: "owner", repo: "repo", pullNumber: 123 })

// Issues
mcp__github__create_issue({ 
  owner: "owner", 
  repo: "repo", 
  title: "Issue title", 
  body: "Description" 
})
mcp__github__list_issues({ owner: "owner", repo: "repo", state: "OPEN" })

// File operations
mcp__github__get_file_contents({ owner: "owner", repo: "repo", path: "file.txt" })
mcp__github__create_or_update_file({ 
  owner: "owner", 
  repo: "repo", 
  path: "file.txt",
  content: "content",
  message: "Update file",
  branch: "main"
})

// Workflow operations
mcp__github__list_workflows({ owner: "owner", repo: "repo" })
mcp__github__run_workflow({ 
  owner: "owner", 
  repo: "repo", 
  workflow_id: "ci.yml", 
  ref: "main" 
})

// Notifications
mcp__github__list_notifications({ filter: "default" })
mcp__github__mark_all_notifications_read()
```

## Current Project Status

### Working Features
- ✅ AI task generation via OpenRouter (3-5 tasks, 38-42 weekly hours)
- ✅ Monday.com task creation with full column mapping
- ✅ Email-based user assignment
- ✅ Province-based city assignment (e.g., Ontario → Toronto, Hamilton, etc.)
- ✅ Dollar amounts ($500-800 per task)
- ✅ Start/End dates with times (6-10 AM EST start times)
- ✅ Webhook trigger system with validation
- ✅ Group creation and management

### Recent Updates (2025-08-12)
- Deployed Telegram bot to DigitalOcean App Platform
- Fixed build command to use yarn instead of npm
- Removed placeholder environment variables that caused runtime errors
- Added detailed task display in bot confirmation messages (priorities, hours, amounts, areas)
- Configured auto-deploy on GitHub push to main branch
- Cleaned up old droplet-based deployment infrastructure
- App Platform URL: https://telegram-crm-bot-pfyvn.ondigitalocean.app

### Previous Updates (2025-08-09)
- Added Province/Area field for city-based task distribution
- Fixed provinces to assign cities instead of province names
- Added Amount column ($500-800 per task)
- Fixed webhook form field mismatch (totalHours → weeklyHours)
- Updated to generate 3-5 tasks (was 10) for more realistic sprints
- Consolidated documentation for better organization

## IMPORTANT: Webhook Form Maintenance

### When Modifying Webhook Input Fields
**ALWAYS update the HTML test form (index.html) whenever you change webhook inputs:**

1. **Check Webhook Validation**: Review the "Validate Input Data" node in the workflow
2. **Update Form Fields**: Ensure `index.html` form fields match webhook expectations:
   - Field names must match exactly (e.g., `weeklyHours` not `totalHours`)
   - Validation rules must align (min/max values, required fields)
   - Default values should be consistent
3. **Update UI Labels**: Make sure descriptions match actual behavior
4. **Test the Form**: Always test the form after changes to verify it works

### Current Webhook Inputs (as of 2025-08-09)
- `projectDescription` (required, min 10 chars)
- `boardId` (required, numbers only)
- `groupId` (optional)
- `groupName` (optional)
- `assigneeEmails` (optional, comma-separated)
- `weeklyHours` (optional, 20-60, default: 40)
- `provinces` (optional, comma-separated list of provinces/areas)

## Development Workflow

### CRITICAL: Workflow Change Process
**ALL WORKFLOW CHANGES MUST FOLLOW THIS EXACT ORDER - NO EXCEPTIONS:**
1. **Update Local File FIRST**: Make all changes in `workflows/monday-tasks-generator-enhanced.json`
2. **Deploy to n8n**: Use `mcp__n8n-mcp__n8n_update_full_workflow()` to upload to n8n instance
3. **Test in n8n**: Run the webhook test command and verify in Monday.com
4. **Commit to Git**: After successful testing, commit with descriptive message
5. **Push to GitHub**: Push the changes to the remote repository

**REMEMBER**: Every workflow change requires THREE UPDATES:
- ✅ Local file (workflows/*.json) 
- ✅ n8n instance (via MCP update)
- ✅ GitHub repository (git commit & push)

**NEVER** update n8n directly without first modifying the local files.
**NEVER** forget to push to GitHub after successful testing.

### General Development Process
1. **Start with Todo List**: Always use TodoWrite to plan tasks
2. **Research First**: Use search tools to understand the codebase
3. **Test Incrementally**: Test each change before moving to the next
4. **Validate Often**: Run validation after significant changes
5. **Document Changes**: Update this file when making structural changes

## Security Considerations
- Never expose API keys or credentials
- Validate all user input
- Use secure webhook endpoints
- Implement rate limiting where appropriate
- Log security-relevant events

## Telegram Remote Control Bot

### Overview
A secure Telegram bot that provides remote control for n8n workflows and other applications. Features conversational commands, password authentication, and 30-day session persistence.

### Bot Setup
```bash
cd telegram-remote-control
yarn install
cp .env.example .env
# Edit .env with your credentials

# Add a user (find your Telegram ID via @userinfobot)
yarn add-user <telegram_id> <username> <password>

# Start the bot
yarn start
```

### Bot Commands
- `/tasks` - Interactive Monday.com task creation
- `/status` - System and workflow status
- `/webhook [name]` - Trigger custom webhooks
- `/deploy` - Deployment control (coming soon)
- `/help` - Show available commands

### Database Tables (Supabase)
- `telegram_users` - Authorized users (manual management)
- `telegram_sessions` - Active sessions (30-day expiry)
- `command_states` - Multi-step conversation tracking
- `command_logs` - Command history and audit trail
- `app_integrations` - Webhook configurations

### Security Features
- Manual user registration only (no self-signup)
- Password authentication on first use
- 30-day session persistence
- Complete command logging
- Telegram ID whitelist

## Quick Reference

### File Locations
- Main workflow: `workflows/monday-tasks-generator-enhanced.json`
- Testing guide: `docs/TESTING.md`
- Web form: `index.html`
- Telegram bot: `telegram-remote-control/`

### API Endpoints
- Webhook: `https://automations-n8n.u841sv.easypanel.host/webhook/monday-tasks`
- n8n API: `https://automations-n8n.u841sv.easypanel.host/api/v1`
- Telegram Bot: https://telegram-crm-bot-pfyvn.ondigitalocean.app

### Credentials
- OpenRouter: "OpenRouter account" credential
- Monday.com: "Monday.com account" (ID: 81ZKNPfmUGTEOCKI)
- Telegram Bot: Token from @BotFather
- Supabase: Service role key required

## Tips from User Feedback

### Productivity Multipliers
1. **Clear Context Often**: Use `/clear` when starting new tasks
2. **Queue Multiple Tasks**: Batch related requests together
3. **Use Extended Thinking**: Add "think harder" for complex problems
4. **Leverage MCP Tools**: Use built-in tools for faster operations

### Common Patterns
1. **Test-Driven Development**: Write tests first, then implementation
2. **Incremental Changes**: Make small, testable changes
3. **Parallel Execution**: Run multiple operations simultaneously
4. **Smart Context Management**: Keep only relevant context active

### Debugging Tips
1. Check execution logs first
2. Validate workflow structure
3. Test with minimal data
4. Use structured logging
5. Monitor API responses

---
*Last Updated: 2025-08-12*
*Status: Production Ready - Workflow & Telegram Bot Fully Functional*