# Check Monday.com Board

Retrieves Monday.com board schema and information.

```bash
echo "Checking Monday.com board 9744010967..."
```

Run these MCP commands:

```javascript
// Get board schema
mcp__monday-api-mcp__get_board_schema({ boardId: 9744010967 })

// Get board info
mcp__monday-api-mcp__get_board_info({ boardId: 9744010967 })

// Get recent activity
mcp__monday-api-mcp__get_board_activity({ 
  boardId: 9744010967,
  fromDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
})
```