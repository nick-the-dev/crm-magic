# Troubleshooting Owner Assignment in Monday.com Workflow

## Quick Diagnostic Steps

### 1. Check n8n Execution Logs
Go to: `https://automations-n8n.u841sv.easypanel.host/workflow/ixbSnRIIcxZnJVjR/executions`

Look for these specific logs in each node:

#### "Process Bulk Lookup" Node
Should show:
```
✅ Mapped gluknik+1@gmail.com -> [USER_ID]
Created user lookup map: {"gluknik+1@gmail.com": USER_ID}
```

If you see:
- `❌ No users found in response` - User doesn't exist in Monday.com
- `❌ GraphQL errors` - API permission issue

#### "Split Tasks With Owners" Node
Should show:
```
Task 1: [Task Name] - Assignee: gluknik+1@gmail.com - Owner ID: [USER_ID]
```

If Owner ID is `null`, the email lookup failed.

#### "Prep Item With Owner" Node
Should show:
```
✅ Setting owner with ID: [USER_ID]
Owner value structure: {"personsAndTeams":[{"id":USER_ID,"kind":"person"}]}
```

### 2. Check Monday.com Board

Go to board: `https://monday.com/boards/9744010967`

Check if tasks have:
- **Owner column populated** - If yes, assignment worked!
- **Owner column empty** - Check the column ID (might not be `project_owner`)
- **Tasks not created** - Workflow failed before task creation

### 3. Common Issues & Fixes

#### Issue: Owner Column Not Being Set

**Possible Causes:**
1. Column ID mismatch (not `project_owner`)
2. User not found in Monday.com
3. Incorrect JSON format for people column

**Fix:**
```javascript
// In "Prep Item With Owner" node, try this format:
columnValues.project_owner = JSON.stringify({
  personsAndTeams: [{
    id: parseInt(ownerId),
    kind: "person"
  }]
});
```

#### Issue: User Lookup Failing

**Check GraphQL Query:**
The query should be:
```graphql
query {
  users(emails: ["gluknik+1@gmail.com"]) {
    id
    name
    email
  }
}
```

**Alternative Query (if emails parameter doesn't work):**
```graphql
query {
  users {
    id
    name
    email
  }
}
```
Then filter in JavaScript.

#### Issue: Workflow Timing Out

**Possible Causes:**
1. OpenRouter API slow/failing
2. Monday.com API slow/failing
3. Infinite loop in code

**Fix:**
Add timeout handling in HTTP Request nodes.

### 4. Test User Lookup Separately

Use this curl command to test Monday.com user lookup:
```bash
curl -X POST https://api.monday.com/v2 \
  -H "Authorization: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query { users(emails: [\"gluknik+1@gmail.com\"]) { id name email } }"}'
```

### 5. Verify Column Structure

Get board schema to verify column IDs:
```bash
curl -X POST https://api.monday.com/v2 \
  -H "Authorization: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query { boards(ids: [9744010967]) { columns { id title type } } }"}'
```

Look for the people/owner column and note its actual ID.

## Debug Mode Testing

### Minimal Test Payload
Test without AI generation:
```json
{
  "projectDescription": "Test",
  "boardId": "9744010967",
  "assigneeEmails": "gluknik+1@gmail.com",
  "groupId": "new_group29179"
}
```

### Check Specific Node Outputs

In n8n, click on each node after execution to see:
1. **Input data** - What the node received
2. **Output data** - What the node produced
3. **Console logs** - Debug messages

### Key Things to Verify

1. **User Lookup Response Structure:**
   ```json
   {
     "data": {
       "users": [
         {
           "id": "79424937",
           "name": "Nick Gluk",
           "email": "gluknik+1@gmail.com"
         }
       ]
     }
   }
   ```

2. **Column Values Format Sent to Monday.com:**
   ```json
   {
     "text9": "Task description",
     "priority_1": {"index": 109, "label": "Medium"},
     "project_owner": {"personsAndTeams":[{"id":79424937,"kind":"person"}]},
     "numbers": "8"
   }
   ```

3. **Monday.com Item Creation Response:**
   Should return the created item with all fields populated.

## If Owner Assignment Still Fails

Try these alternative approaches:

### Option 1: Update After Creation
Instead of setting owner during creation, update it after:
```javascript
// Create item first
const item = await createItem(boardId, groupId, taskName);

// Then update owner
await updateColumnValue(boardId, item.id, "project_owner", {
  personsAndTeams: [{id: ownerId, kind: "person"}]
});
```

### Option 2: Use Direct GraphQL Mutation
```graphql
mutation {
  create_item(
    board_id: 9744010967,
    group_id: "new_group29179",
    item_name: "Task Name",
    column_values: "{\"project_owner\":{\"personsAndTeams\":[{\"id\":79424937,\"kind\":\"person\"}]}}"
  ) {
    id
  }
}
```

### Option 3: Simplify Column Value Format
Some Monday.com APIs accept simpler formats:
```javascript
columnValues.project_owner = ownerId.toString();
// or
columnValues.project_owner = [ownerId];
```

## Next Steps

1. Check n8n execution logs for the specific error
2. Verify the actual column ID in Monday.com
3. Test user lookup separately
4. Try alternative column value formats
5. Consider updating owner after task creation if setting during creation fails

## Support

If issues persist:
1. Check Monday.com API documentation for people column format
2. Review n8n Monday.com node documentation
3. Test with Monday.com's API playground
4. Enable verbose logging in n8n workflow