# ✅ Quick Test Checklist

## Pre-Test Verification (30 seconds)
- [ ] n8n instance is running at: `https://automations-n8n.u841sv.easypanel.host`
- [ ] Workflow ID `6IDxhXNS4X028T1O` is ACTIVE
- [ ] Monday.com board `9744010967` is accessible

## Run Test (1 minute)
```javascript
// COPY THIS ENTIRE BLOCK AND RUN:
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

## Success Indicators
- [ ] Response shows `"success": true`
- [ ] Response shows `"tasksCreated": 10`
- [ ] Execution completes in ~30-40 seconds
- [ ] No error messages in response

## If Test Fails, Check:
1. **Workflow Not Active?**
   ```javascript
   mcp__n8n-mcp__n8n_list_workflows({ limit: 10 })
   ```

2. **Check Last Execution Error:**
   ```javascript
   mcp__n8n-mcp__n8n_list_executions({
     workflowId: "6IDxhXNS4X028T1O",
     limit: 1,
     includeData: false
   })
   ```

3. **Validate Workflow Configuration:**
   ```javascript
   mcp__n8n-mcp__n8n_validate_workflow({
     id: "6IDxhXNS4X028T1O",
     options: { validateNodes: true, validateConnections: true }
   })
   ```

## Alternative Test Payloads

### Test 1: Web Development Project
```javascript
{
  projectDescription: "Create a responsive e-commerce website with payment integration",
  boardId: "9744010967",
  assigneeEmails: "gluknik+1@gmail.com"
}
```

### Test 2: Mobile App Project
```javascript
{
  projectDescription: "Develop a fitness tracking mobile app for iOS and Android",
  boardId: "9744010967",
  assigneeEmails: "gluknik+1@gmail.com"
}
```

### Test 3: Data Analysis Project
```javascript
{
  projectDescription: "Build a real-time analytics dashboard for sales performance",
  boardId: "9744010967",
  assigneeEmails: "gluknik+1@gmail.com"
}
```

## Common Issues & Quick Fixes

| Issue | Quick Fix |
|-------|-----------|
| Workflow inactive | `mcp__n8n-mcp__n8n_update_full_workflow({ id: "6IDxhXNS4X028T1O", active: true })` |
| Wrong webhook URL | Use: `https://automations-n8n.u841sv.easypanel.host/webhook/monday-tasks` |
| Board ID invalid | Always use: `9744010967` |
| OpenRouter API failing | Check credentials in n8n UI |
| Monday.com API failing | Check API token in n8n credentials |

## Test Execution Times
- **Normal**: 30-40 seconds
- **With delays**: 45-60 seconds
- **Timeout concern**: >90 seconds

---
**Last Verified**: 2025-08-07
**Status**: ✅ WORKING