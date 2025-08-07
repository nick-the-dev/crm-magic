# Test Monday.com Workflow

Triggers the Monday.com AI task generator workflow with test data.

```bash
echo "Testing Monday.com workflow..."
```

Run the following MCP command to test the workflow:

```javascript
mcp__n8n-mcp__n8n_trigger_webhook_workflow({
  webhookUrl: "https://automations-n8n.u841sv.easypanel.host/webhook/monday-tasks",
  httpMethod: "POST",
  data: {
    projectDescription: "$ARGUMENTS",
    boardId: "9744010967",
    assigneeEmails: "gluknik+1@gmail.com"
  },
  waitForResponse: true
})
```

Default project description if none provided: "Build an AI-powered customer feedback analysis system"