# Validate n8n Workflow

Validates the Monday.com workflow configuration and checks for issues.

```bash
echo "Validating workflow ID: 6IDxhXNS4X028T1O"
```

Run these validation checks:

```javascript
// Check workflow status
mcp__n8n-mcp__n8n_get_workflow_details({ id: "6IDxhXNS4X028T1O" })

// Validate configuration
mcp__n8n-mcp__n8n_validate_workflow({
  id: "6IDxhXNS4X028T1O",
  options: {
    validateNodes: true,
    validateConnections: true,
    validateExpressions: true,
    profile: "runtime"
  }
})

// Check recent executions
mcp__n8n-mcp__n8n_list_executions({
  workflowId: "6IDxhXNS4X028T1O",
  limit: 5,
  includeData: false
})
```