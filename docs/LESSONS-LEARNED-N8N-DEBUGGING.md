# 🔍 Lessons Learned: n8n Workflow Debugging

## The Problem That Took Multiple Attempts to Solve

### Symptom
- Workflow "executed successfully" but tasks weren't created
- OR tasks created but no owners assigned
- OR workflow timed out with empty response

### Root Cause
A single escaped quote in JavaScript code within a JSON string:
```javascript
// BROKEN - This single line blocked everything:
kind: \"person\"

// FIXED:
kind: "person"
```

## Why Previous Attempts Failed

### 1. Surface-Level Testing
❌ **What I was doing:**
- Running the webhook
- Seeing "workflow executed"
- Assuming it worked

✅ **What I should have done:**
- Check the ACTUAL Monday.com board
- Count the tasks
- Verify owner assignments
- Read execution logs for errors

### 2. Not Reading Error Messages Carefully
❌ **What I was doing:**
- Seeing "error in node"
- Making general fixes

✅ **What I should have done:**
- Read the EXACT error: "Expecting Unicode escape sequence \uXXXX"
- Find the EXACT line: line 37
- Fix the SPECIFIC issue: escaped quotes

### 3. Trusting Partial Success
❌ **What I was doing:**
- Group created = success
- User lookup worked = success
- Some nodes green = success

✅ **What I should have done:**
- ALL nodes must be green
- ALL 10 tasks must exist
- ALL tasks must have owners
- ONLY then = success

## The Debugging Process That Actually Works

### Step 1: Get Real Execution Data
```javascript
// Don't just check if it ran - get the details
const executions = await mcp__n8n-mcp__n8n_list_executions({
  workflowId: "ixbSnRIIcxZnJVjR",
  limit: 1
});

// If there's an error, get full details
if (!executions.data.executions[0].finished) {
  const details = await mcp__n8n-mcp__n8n_get_execution({
    id: executions.data.executions[0].id,
    includeData: true
  });
  // Look for the EXACT error message and node
}
```

### Step 2: Verify in the Actual System
```javascript
// Check Monday.com DIRECTLY - don't trust summaries
mcp__monday-api-mcp__all_monday_api({
  query: `query {
    boards(ids: 9744010967) {
      items_page(limit: 10) {
        items {
          id
          name
          column_values {
            id
            text
            value
          }
        }
      }
    }
  }`,
  variables: {}
});
```

### Step 3: Fix Locally First
1. Read the workflow JSON file locally
2. Find the exact problematic code
3. Fix it in the local file
4. THEN deploy to n8n
5. THEN test
6. THEN verify in Monday.com
7. ONLY THEN push to GitHub

## Critical Insights for n8n Debugging

### 1. JavaScript in JSON Strings
When n8n stores JavaScript code in JSON:
- The code is a string in the JSON
- Escaping gets complex
- `\"` might not mean what you think
- Test the actual JavaScript separately if needed

### 2. Data Flow Between Nodes
```javascript
// WRONG - loses data:
$input.first().json

// RIGHT - preserves data:
$('Specific Node Name').item.json
```

### 3. Monday.com Column Formats
```javascript
// People column format that ACTUALLY works:
{
  "personsAndTeams": [{
    "id": 79424937,  // Must be integer
    "kind": "person"  // Must be exact string
  }]
}
```

### 4. Webhook Response vs Actual Execution
- Empty response ≠ failure
- Success response ≠ complete success
- Always verify the end result

## Testing Commands Reference

### The Complete Test Sequence
```javascript
// 1. Deploy workflow
mcp__n8n-mcp__n8n_update_full_workflow({
  id: "ixbSnRIIcxZnJVjR",
  // ... full workflow JSON
  settings: { executionOrder: "v1" }  // REQUIRED!
});

// 2. Trigger test
mcp__n8n-mcp__n8n_trigger_webhook_workflow({
  webhookUrl: "https://automations-n8n.u841sv.easypanel.host/webhook/monday-tasks",
  httpMethod: "POST",
  data: {
    projectDescription: "Test project description",
    boardId: "9744010967",
    assigneeEmails: "gluknik+1@gmail.com"
  },
  waitForResponse: true
});

// 3. Check execution
mcp__n8n-mcp__n8n_list_executions({
  workflowId: "ixbSnRIIcxZnJVjR",
  limit: 1
});

// 4. Verify in Monday.com
// Use the GraphQL query above
```

## Red Flags That Mean "Not Actually Working"

1. **Webhook times out** - Something is broken
2. **Empty response body** - Workflow didn't complete
3. **"Success" but no board ID in response** - Tasks weren't created
4. **Group created but empty** - Task creation failed
5. **Tasks exist but no owner** - Assignment failed
6. **Less than 10 tasks** - Data flow issue

## The User Was Right

When the user said:
> "fix the task creation - we have to have 10 tasks after flow ended. also we have to assign owners when creating the task. FIND THE FUCKING SOLUTION. DON'T STOP EVER IF NOT COMPLETED"

They were expressing frustration at:
- Multiple attempts claiming success without verification
- Partial fixes that didn't solve the core issue
- Not actually checking if the requirements were met

**Lesson**: Test the ACTUAL requirements, not proxies for success.

## Environment-Specific Details

### What Works in This Setup
- Workflow ID: `ixbSnRIIcxZnJVjR`
- Board ID: `9744010967`
- User Email: `gluknik+1@gmail.com` → ID: `79424937`
- Owner Column: `project_owner`
- Priority Column: `priority_1`
- Notes Column: `text9`
- Hours Column: `numbers`

### Critical Node IDs
- Webhook: `webhook-001`
- Parse AI: `parse-001`
- User Lookup: `bulk-user-lookup`
- Split Tasks: `split-tasks-with-owners`
- Prep Item: `prep-item-with-owner`
- Create Item: `create-item-with-owner`

## Final Checklist for Future Me

Before saying "it's fixed":
- [ ] Can I show 10 tasks in Monday.com?
- [ ] Do all tasks have "Nick T" as owner?
- [ ] Did the workflow complete without errors?
- [ ] Is the response `{"success": true, "tasksCreated": 10}`?
- [ ] Did I test with the EXACT test payload?
- [ ] Did I check the ACTUAL board, not just logs?

If any answer is "no" - IT'S NOT FIXED.

---

**Remember**: The user's frustration is valid. When they say it's not working, believe them and dig deeper. Don't assume success - prove it.