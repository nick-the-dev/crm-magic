# Claude Code Project Configuration

## Project Overview
This is a Monday.com CRM automation project that uses n8n workflows to generate and manage tasks with AI-powered task creation.

## Project Structure
```
crm-magic/
├── .claude/                     # Claude Code configuration
│   └── commands/                # Custom slash commands
├── docs/                        # Documentation
│   ├── testing/
│   │   ├── testing-instructions.md  # Comprehensive testing guide
│   │   └── quick-test-checklist.md  # Quick test reference
│   └── workflows/              # Workflow documentation
├── workflows/                   # n8n workflow files
│   └── monday-tasks-generator-enhanced.json
├── test/                       # Test files
│   └── test-workflow.js
├── README.md                   # Project overview
└── CLAUDE.md                   # This file - Claude instructions
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
    assigneeEmails: "gluknik+1@gmail.com"
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

// Check executions
mcp__n8n-mcp__n8n_list_executions({
  workflowId: "ixbSnRIIcxZnJVjR",
  limit: 10
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

## Current Project Status

### Working Features
- ✅ AI task generation via OpenRouter
- ✅ Monday.com task creation
- ✅ Email-based user assignment
- ✅ Webhook trigger system
- ✅ Error handling and validation

### Known Issues
- None currently - workflow is production ready

### Recent Updates
- Fixed workflow bottleneck in data merging
- Implemented AI-only parsing (removed fallback)
- Updated all node connections for proper data flow
- Validated all 10 tasks are created successfully

## Development Workflow

### CRITICAL: Workflow Change Process
**ALL WORKFLOW CHANGES MUST FOLLOW THIS ORDER:**
1. **Local First**: Make all changes in the local project folder (workflows/*.json)
2. **Deploy to n8n**: Upload the modified workflow to n8n instance
3. **Test in n8n**: Thoroughly test the workflow in the n8n interface
4. **Push to GitHub**: Only after successful testing, commit and push changes

**NEVER** update n8n directly without first modifying the local files.

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

## Quick Reference

### File Locations
- Main workflow: `monday-tasks-generator-enhanced.json`
- Test script: `test-workflow.js`
- Testing docs: `docs/testing/testing-instructions.md`
- Quick tests: `docs/testing/quick-test-checklist.md`

### API Endpoints
- Webhook: `https://automations-n8n.u841sv.easypanel.host/webhook/monday-tasks`
- n8n API: `https://automations-n8n.u841sv.easypanel.host/api/v1`

### Credentials
- OpenRouter: "OpenRouter account" credential
- Monday.com: "Monday.com account" (ID: 81ZKNPfmUGTEOCKI)

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
*Last Updated: 2025-08-07*
*Status: Production Ready*