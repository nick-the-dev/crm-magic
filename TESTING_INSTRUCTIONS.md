# 🧪 Testing & Debugging Instructions

## Complete End-to-End Testing Methodology

### 1. Initial Setup Verification

**Check Workflow Status:**
```bash
# Using n8n MCP tools to verify workflow exists and is active
mcp__n8n-mcp__n8n_list_workflows()
mcp__n8n-mcp__n8n_get_workflow_details(id: "6IDxhXNS4X028T1O")
```

**Verify Credentials Configuration:**
- **OpenRouter API**: Must be configured as "OpenRouter account" credential
  - Uses dual authentication: `openRouterApi` + `httpHeaderAuth`
  - API key format: `sk-or-v1-...`
- **Monday.com API**: Uses "Monday.com account" credential (ID: `81ZKNPfmUGTEOCKI`)
  - For both task creation AND user lookup via GraphQL

### 2. Webhook Testing Protocol

**Get Webhook URL:**
```javascript
// From the workflow, webhook node has path: "monday-tasks"
// Full webhook URL format: https://your-n8n-instance.com/webhook/monday-tasks
```

**Test Request Format:**
```bash
curl -X POST https://your-n8n-instance.com/webhook/monday-tasks \
  -H "Content-Type: application/json" \
  -d '{
    "projectDescription": "Build a recipe recommendation system that suggests meals based on dietary preferences and available ingredients",
    "boardId": "9744010967",
    "assigneeEmails": "gluknik+1@gmail.com"
  }'
```

**Standard Test Parameters:**
- **Board ID**: `9744010967` (always use this for testing)
- **Assignee Email**: `gluknik+1@gmail.com` (for user assignment testing)
- **Project Description**: Use varied, detailed descriptions (minimum 10 characters)

### 3. Debugging Flow Issues

#### Step-by-Step Node Analysis

**1. Webhook Input Validation:**
- Check `Validate Input Data` node output
- Verify board ID regex: `!/^\\d+$/.test(boardId)` (single backslash, not double)
- Confirm project description length > 10 characters

**2. AI Generation Testing:**
- Monitor `AI - Generate Tasks` node for API response
- Verify OpenRouter credentials are working
- Check for HTTP 401 (authentication) or 429 (rate limit) errors

**3. Parse AI Tasks Node:**
- **CRITICAL**: This node was simplified to AI-only (no fallback)
- Verify JSON extraction regex: `/\\{[\\s\\S]*\\}/s`
- Ensure AI response contains valid tasks array
- Check email assignment logic for assignee mapping

**4. Flow Bottleneck Analysis:**
- **Previous Issue**: "Merge Results" node was bottlenecking flow
- **Solution**: Direct connection from "Monday - Update Item" to "Create Summary"
- **Verification**: Confirm all 10 tasks reach the summary node

**5. User Lookup Flow:**
- Verify email detection in `User Lookup Prep` node
- Check GraphQL query format in `Monday - User Lookup` node
- Confirm user ID resolution and assignment to `project_owner` column

### 4. Common Issues & Fixes

#### Issue 1: Only 1 Task Created Instead of 10
**Root Cause**: Flow bottleneck in data merging
**Fix**: Remove bottleneck nodes, ensure proper data flow through "Split Tasks" node
**Verification**: Check that `Split Tasks` outputs 10 separate items

#### Issue 2: Board ID Validation Failing
**Root Cause**: Double backslash in regex `!/^\\\\d+$/.test(boardId)`
**Fix**: Change to single backslash `!/^\\d+$/.test(boardId)`
**Test**: Try boardId "9744010967" - should pass validation

#### Issue 3: OpenRouter Authentication Errors
**Root Cause**: Missing or incorrect credential configuration
**Fix**: Ensure "OpenRouter account" credential exists with proper API key
**Test**: Check for HTTP 200 response from OpenRouter API

#### Issue 4: User Assignment Not Working
**Root Cause**: Email not found in Monday.com or incorrect GraphQL query
**Fix**: Verify user exists, check GraphQL response structure
**Fallback**: User info stored in Notes column if lookup fails

### 5. n8n API Validation Error Handling

#### Critical Error: "Invalid request: request/body must have required property 'settings'"

**Root Cause**: n8n API requires the `settings` property when updating workflows through MCP tools

**Fix**: Always include the settings parameter in n8n API calls:

```javascript
// When using n8n MCP tools for workflow updates:
mcp__n8n-mcp__n8n_update_full_workflow({
  id: "6IDxhXNS4X028T1O",
  nodes: [...],
  connections: {...},
  settings: {
    "executionOrder": "v1"
  }
})
```

**Complete MCP Update Example:**
```javascript
// Proper workflow update with all required fields
const workflowUpdate = {
  id: "6IDxhXNS4X028T1O",
  name: "Monday.com AI Tasks Generator - Enhanced",
  nodes: updatedNodesArray,
  connections: connectionsObject,
  settings: {
    executionOrder: "v1"
  }
};

// Execute update
mcp__n8n-mcp__n8n_update_full_workflow(workflowUpdate);
```

**Alternative: Use Partial Updates for Minor Changes**
```javascript
// For small fixes, use partial updates instead
mcp__n8n-mcp__n8n_update_partial_workflow({
  id: "6IDxhXNS4X028T1O",
  operations: [
    {
      type: "updateNode",
      nodeId: "parse-001",
      updates: {
        parameters: {
          jsCode: "// Updated code here"
        }
      }
    }
  ]
});
```

### 6. Code Debug Loop Process

#### Systematic Debugging Approach:

1. **Identify Failing Node**
   - Check execution logs in n8n interface
   - Look for error messages or unexpected outputs
   - Use `console.log()` statements in Code nodes

2. **Isolate the Issue**
   - Test individual node logic separately
   - Verify data formats match expected structures
   - Check credential configurations

3. **Implement Fix**
   - Update node code or configuration
   - Test fix with minimal viable data
   - Verify fix doesn't break downstream nodes

4. **End-to-End Verification**
   - Run complete workflow with test parameters
   - Confirm all 10 tasks are created in Monday.com
   - Verify user assignment and column data

#### Key Debugging Commands:

```javascript
// In Code nodes, use comprehensive logging:
console.log('=== NODE DEBUG ===');
console.log('Input data:', JSON.stringify($json, null, 2));
console.log('Available functions:', Object.keys($));
console.log('All inputs:', $input.all().length);
```

### 7. n8n MCP Tools Reference

#### Essential Commands for Workflow Management:

**List Workflows:**
```javascript
mcp__n8n-mcp__n8n_list_workflows({ limit: 50 })
```

**Get Workflow Details:**
```javascript
mcp__n8n-mcp__n8n_get_workflow_details({ id: "6IDxhXNS4X028T1O" })
```

**Validate Workflow:**
```javascript
mcp__n8n-mcp__n8n_validate_workflow({
  id: "6IDxhXNS4X028T1O",
  options: {
    validateNodes: true,
    validateConnections: true,
    validateExpressions: true,
    profile: "runtime"
  }
})
```

**Trigger Webhook Test:**
```javascript
mcp__n8n-mcp__n8n_trigger_webhook_workflow({
  webhookUrl: "https://your-n8n-instance.com/webhook/monday-tasks",
  httpMethod: "POST",
  data: {
    projectDescription: "Build a recipe recommendation system",
    boardId: "9744010967",
    assigneeEmails: "gluknik+1@gmail.com"
  },
  waitForResponse: true
})
```

**Check Execution Results:**
```javascript
// List recent executions
mcp__n8n-mcp__n8n_list_executions({
  workflowId: "6IDxhXNS4X028T1O",
  limit: 10,
  includeData: true
})

// Get specific execution details
mcp__n8n-mcp__n8n_get_execution({
  id: "execution-id-here",
  includeData: true
})
```

#### Workflow Update Best Practices:

1. **Always Validate First:**
   ```javascript
   // Before making changes, validate current state
   mcp__n8n-mcp__n8n_validate_workflow({ id: "6IDxhXNS4X028T1O" })
   ```

2. **Use Partial Updates for Small Changes:**
   - Faster execution
   - Less prone to validation errors
   - Better for iterative debugging

3. **Include Required Settings:**
   - Always add `"settings": {"executionOrder": "v1"}`
   - Prevents "required property 'settings'" error

4. **Test After Each Change:**
   ```javascript
   // Immediate test after update
   mcp__n8n-mcp__n8n_trigger_webhook_workflow({
     webhookUrl: "https://your-n8n-instance.com/webhook/monday-tasks",
     httpMethod: "POST",
     data: testPayload,
     waitForResponse: true
   })
   ```

### 8. Success Criteria

**Complete Success Indicators:**
- ✅ Webhook receives POST request successfully
- ✅ AI generates 10 realistic, professional tasks
- ✅ All 10 tasks are created in Monday.com board 9744010967
- ✅ Tasks are properly assigned to gluknik+1@gmail.com
- ✅ Column data populated: priority, notes, estimated hours
- ✅ Summary response shows "tasksCreated: 10"

**Response Format for Success:**
```json
{
  "success": true,
  "message": "Successfully created 10 tasks in Monday.com!",
  "tasksCreated": 10,
  "boardId": "9744010967",
  "timestamp": "2025-08-06T23:XX:XX.XXXZ"
}
```

### 9. Workflow Architecture Notes

**Critical Flow Path:**
```
Webhook → Validate → AI Generate → Parse AI Tasks → 
IF Group Exists → Split Tasks (outputs 10 items) → 
Prep Create Item → Monday Create Item → Combine Data → 
User Lookup → Merge Data → Prepare Columns → 
Monday Update Item → Create Summary → Response
```

**Data Preservation Strategy:**
- Each Code node must preserve task data for downstream processing
- Use `$('NodeName').item.json` to access specific node outputs
- Critical: "Split Tasks" node creates 10 separate execution paths

**Column Mapping:**
- `text9` (Notes): Task descriptions + assignee fallback
- `priority_1` (Priority): High/Medium/Low with proper indices
- `project_owner` (Owner): User ID from email lookup
- `numbers` (Hours): Estimated hours from AI

### 10. Testing Variations

**Different Project Types to Test:**
1. Web application development
2. Mobile app creation
3. Data analysis project
4. Marketing campaign
5. Infrastructure setup

**Edge Cases to Verify:**
- Very long project descriptions (>500 chars)
- Email addresses not found in Monday.com
- AI API temporary failures
- Board permissions issues
- Network connectivity problems

### 11. Complete E2E Testing Script

**Full Test Sequence Using n8n MCP Tools:**

```javascript
// 1. Verify workflow status
const workflow = await mcp__n8n-mcp__n8n_get_workflow_details({ id: "6IDxhXNS4X028T1O" });
console.log('Workflow active:', workflow.active);

// 2. Validate workflow integrity
const validation = await mcp__n8n-mcp__n8n_validate_workflow({ id: "6IDxhXNS4X028T1O" });
if (validation.errors.length > 0) {
  console.error('Validation errors:', validation.errors);
  return;
}

// 3. Execute test
const testPayload = {
  projectDescription: "Build a recipe recommendation system that suggests meals based on dietary preferences and available ingredients",
  boardId: "9744010967",
  assigneeEmails: "gluknik+1@gmail.com"
};

const result = await mcp__n8n-mcp__n8n_trigger_webhook_workflow({
  webhookUrl: "https://your-n8n-instance.com/webhook/monday-tasks",
  httpMethod: "POST",
  data: testPayload,
  waitForResponse: true
});

// 4. Verify success
if (result.success && result.tasksCreated === 10) {
  console.log('✅ SUCCESS: All 10 tasks created!');
  console.log('Board ID:', result.boardId);
  console.log('Timestamp:', result.timestamp);
} else {
  console.error('❌ FAILURE:', result);
  
  // 5. Debug failed execution
  const executions = await mcp__n8n-mcp__n8n_list_executions({
    workflowId: "6IDxhXNS4X028T1O",
    limit: 1,
    includeData: true
  });
  
  console.log('Last execution details:', executions.data[0]);
}
```

### 12. Emergency Fixes Reference

**Quick Fix Commands for Common Issues:**

```javascript
// Fix 1: Update Parse AI Tasks node (remove fallback)
mcp__n8n-mcp__n8n_update_partial_workflow({
  id: "6IDxhXNS4X028T1O",
  operations: [{
    type: "updateNode",
    nodeId: "parse-001",
    updates: {
      parameters: {
        jsCode: `// AI-only parsing code here`
      }
    }
  }]
});

// Fix 2: Update node execution mode
mcp__n8n-mcp__n8n_update_partial_workflow({
  id: "6IDxhXNS4X028T1O",
  operations: [{
    type: "updateNode",
    nodeId: "prep-create-001",
    updates: {
      parameters: {
        mode: "runOnceForEachItem"
      }
    }
  }]
});

// Fix 3: Update JavaScript compatibility
mcp__n8n-mcp__n8n_update_partial_workflow({
  id: "6IDxhXNS4X028T1O",
  operations: [{
    type: "updateNode",
    nodeId: "combine-data-001",
    updates: {
      parameters: {
        jsCode: `// Replace $input.first() with $input.item.json`
      }
    }
  }]
});
```

This comprehensive methodology ensures consistent, reliable testing and debugging of the Monday.com AI Tasks Generator workflow with full n8n MCP integration and proper API validation error handling.