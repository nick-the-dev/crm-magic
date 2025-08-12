# Testing Guide

## Quick Test Command

```javascript
mcp__n8n-mcp__n8n_trigger_webhook_workflow({
  webhookUrl: "https://automations-n8n.u841sv.easypanel.host/webhook/monday-tasks",
  httpMethod: "POST",
  data: {
    projectDescription: "Build an AI-powered customer feedback analysis system",
    boardId: "9744010967",
    assigneeEmails: "gluknik+1@gmail.com",
    weeklyHours: 40,
    provinces: "Ontario"  // Optional: will assign cities from Ontario
  },
  waitForResponse: true
})
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Successfully created 3 tasks for this week in Monday.com!",
  "tasksCreated": 3
}
```

## Test Environment

- **n8n Instance**: `https://automations-n8n.u841sv.easypanel.host`
- **Webhook Path**: `/webhook/monday-tasks`
- **Workflow ID**: `ixbSnRIIcxZnJVjR`
- **Monday Board**: `9744010967`
- **Test Email**: `gluknik+1@gmail.com`

## Input Parameters

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| projectDescription | Yes | Project details (min 10 chars) | "Build a mobile expense tracker" |
| boardId | Yes | Monday.com board ID | "9744010967" |
| assigneeEmails | No | Comma-separated emails | "user1@example.com, user2@example.com" |
| weeklyHours | No | Total weekly hours (20-60) | 40 |
| provinces | No | Canadian provinces for city assignment | "Ontario, Quebec" |
| groupId | No | Existing group ID | "new_group12345" |
| groupName | No | Custom group name | "Sprint Week 1" |

## Features

- **AI Task Generation**: Creates 3-5 realistic tasks (38-42 weekly hours)
- **Smart Scheduling**: Single-day tasks (8 hours each) with varied start times (6-10 AM)
- **User Assignment**: Email-based Monday.com user lookup and assignment
- **Column Population**:
  - Priority (High/Medium/Low)
  - Notes (task descriptions)
  - Start/End dates with times
  - Amount ($500-800 per task)
  - Area (cities from specified provinces)
- **Group Management**: Creates new groups or uses existing ones

## Troubleshooting

### Check Workflow Status
```javascript
mcp__n8n-mcp__n8n_list_workflows({ limit: 10 })
```

### Validate Workflow
```javascript
mcp__n8n-mcp__n8n_validate_workflow({ id: "ixbSnRIIcxZnJVjR" })
```

### Check Last Execution
```javascript
mcp__n8n-mcp__n8n_list_executions({
  workflowId: "ixbSnRIIcxZnJVjR",
  limit: 5,
  includeData: false  // IMPORTANT: Never use true (exceeds token limits)
})
```

### Verify in Monday.com
```javascript
mcp__monday-api-mcp__get_board_items_by_name({
  boardId: 9744010967,
  term: "your-search-term"
})
```

## Alternative Test Payloads

### Mobile App Project
```javascript
{
  projectDescription: "Develop a fitness tracking app with social features",
  boardId: "9744010967",
  assigneeEmails: "gluknik+1@gmail.com",
  provinces: "British Columbia"
}
```

### Data Analysis Project
```javascript
{
  projectDescription: "Build real-time analytics dashboard for sales",
  boardId: "9744010967",
  assigneeEmails: "gluknik+1@gmail.com",
  provinces: "Quebec, Ontario"
}
```

## Success Criteria

✅ Webhook responds with success  
✅ 3-5 tasks created in Monday.com  
✅ Tasks assigned to correct users  
✅ All columns populated correctly  
✅ Cities assigned from specified provinces  
✅ Response time: 20-40 seconds  

## Common Issues

| Issue | Solution |
|-------|----------|
| Workflow inactive | Check with `n8n_list_workflows()` |
| Wrong webhook URL | Use exact URL from environment section |
| Board ID invalid | Always use `9744010967` for testing |
| User not found | Verify email exists in Monday.com |
| No cities assigned | Ensure provinces field is provided |

---
**Last Updated**: 2025-08-09  
**Status**: ✅ Production Ready