# Project Guide - CRM Magic

## Overview
This project automates Monday.com task management using AI-powered task generation through n8n workflows.

## Quick Start

### 1. Using Claude Code Commands

**Test the workflow:**
```bash
/test-workflow "Create a mobile app for fitness tracking"
```

**Validate configuration:**
```bash
/validate-workflow
```

**Check Monday board:**
```bash
/check-board
```

### 2. Manual Testing
See `docs/testing/quick-test-checklist.md` for the fastest test method.

## Architecture

### Components
1. **n8n Workflow** - Orchestrates the entire process
2. **OpenRouter AI** - Generates intelligent task suggestions
3. **Monday.com API** - Creates and manages tasks
4. **Webhook Trigger** - Initiates the workflow

### Data Flow
```
User Input → Webhook → Validation → AI Generation → 
Task Parsing → User Lookup → Monday.com Creation → Response
```

## Development Workflow

### Making Changes

1. **Plan First**: Use the todo list to organize tasks
2. **Test Locally**: Use the test commands before deploying
3. **Validate**: Run workflow validation after changes
4. **Document**: Update CLAUDE.md if making structural changes

### Best Practices

#### Code Quality
- Follow existing patterns in the codebase
- Validate all external inputs
- Implement proper error handling
- Use structured logging

#### Testing
- Test each component individually
- Run end-to-end tests after changes
- Monitor execution times
- Check error logs

#### Documentation
- Keep documentation concise and actionable
- Update when functionality changes
- Include examples where helpful

## Troubleshooting

### Common Issues

**Workflow Not Active**
```javascript
mcp__n8n-mcp__n8n_update_full_workflow({ 
  id: "6IDxhXNS4X028T1O", 
  active: true 
})
```

**Authentication Errors**
- Check OpenRouter API key in n8n credentials
- Verify Monday.com token is valid
- Ensure webhook URL is accessible

**Task Creation Failures**
- Verify board ID exists: `9744010967`
- Check user email exists in Monday.com
- Validate column mappings match board schema

### Debug Commands

**Check Recent Errors:**
```javascript
mcp__n8n-mcp__n8n_list_executions({
  workflowId: "6IDxhXNS4X028T1O",
  status: "error",
  limit: 5
})
```

**View Execution Details:**
```javascript
mcp__n8n-mcp__n8n_get_execution({
  id: "execution-id",
  includeData: true
})
```

## API Reference

### Webhook Endpoint
- **URL**: `https://automations-n8n.u841sv.easypanel.host/webhook/monday-tasks`
- **Method**: POST
- **Content-Type**: application/json

### Request Payload
```json
{
  "projectDescription": "string (required, min 10 chars)",
  "boardId": "string (required, numeric)",
  "assigneeEmails": "string (optional, comma-separated)",
  "groupId": "string (optional)",
  "groupName": "string (optional)"
}
```

### Response Format
```json
{
  "success": true,
  "message": "Successfully created 10 tasks in Monday.com!",
  "tasksCreated": 10,
  "boardId": "9744010967",
  "timestamp": "2025-08-07T00:00:00.000Z"
}
```

## Configuration

### Environment Variables
- Managed through n8n UI
- No local environment setup required

### Credentials
- **OpenRouter**: API key for AI generation
- **Monday.com**: API token for task management

### Settings
- Default board: `9744010967`
- Default assignee: `gluknik+1@gmail.com`
- Tasks per generation: 10

## Security

### Best Practices
- Never commit credentials to version control
- Validate all user inputs
- Use HTTPS for all API calls
- Implement rate limiting
- Log security events

### Access Control
- Webhook requires valid payload
- Monday.com API requires authentication
- n8n instance has access controls

## Performance

### Optimization Tips
- Batch API calls when possible
- Cache user lookups
- Use parallel processing
- Monitor execution times

### Benchmarks
- Normal execution: 30-40 seconds
- With delays: 45-60 seconds
- Timeout threshold: 90 seconds

## Maintenance

### Regular Tasks
- Check API rate limits
- Monitor error rates
- Update dependencies
- Review security logs

### Upgrade Path
- Test in development first
- Backup workflow before changes
- Validate after updates
- Document breaking changes

## Resources

### Internal Documentation
- [Testing Instructions](testing/testing-instructions.md)
- [Quick Test Checklist](testing/quick-test-checklist.md)
- [Claude Instructions](../CLAUDE.md)

### External Resources
- [n8n Documentation](https://docs.n8n.io)
- [Monday.com API](https://developer.monday.com)
- [OpenRouter API](https://openrouter.ai/docs)

## Support

### Getting Help
- Check troubleshooting section first
- Review error logs
- Test with minimal payload
- Validate workflow configuration

### Reporting Issues
- Include error messages
- Provide test payload
- Note time of occurrence
- Describe expected vs actual behavior

---
*Last Updated: 2025-08-07*
*Version: 1.0.0*
*Status: Production Ready*