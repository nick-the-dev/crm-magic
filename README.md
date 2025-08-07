# 🚀 Monday.com Tasks Generator - Enhanced

Generate 10 realistic project tasks with AI and automatically add them to your Monday.com board with smart email-based user assignment.

## 📁 Project Structure

```
crm-magic/
├── .claude/                           # Claude Code configuration
│   └── commands/                      # Custom slash commands
│       ├── test-workflow.md          # Test workflow command
│       ├── validate-workflow.md      # Validation command
│       └── check-board.md            # Board inspection command
├── docs/                              # Documentation
│   └── testing/                       # Testing documentation
│       ├── testing-instructions.md    # Comprehensive testing guide
│       └── quick-test-checklist.md    # Quick test reference
├── workflows/                         # n8n workflow files
│   └── monday-tasks-generator-enhanced.json
├── test/                              # Test files
│   └── test-workflow.js              # Test script with payload options
├── index.html                        # Optional external form interface
├── README.md                          # Project overview (this file)
└── CLAUDE.md                          # Claude Code instructions & best practices
```

## 📝 Quick Reference

- **Main Workflow**: `workflows/monday-tasks-generator-enhanced.json`
- **Testing Guide**: `docs/testing/testing-instructions.md`
- **Quick Tests**: `docs/testing/quick-test-checklist.md`
- **Claude Instructions**: `CLAUDE.md` - Best practices and project configuration

## 🚀 Quick Test

Run this command with n8n MCP tools:
```javascript
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

## ⚡ Quick Setup

1. **Import Workflow**
   - Open n8n
   - Import `monday-tasks-generator-enhanced.json`

2. **Configure Credentials**
   - **OpenRouter API**: Use the predefined "OpenRouter account" credential
     - Go to n8n Credentials → OpenRouter account
     - Add your OpenRouter API key
   - **Monday.com API**: Use the "Monday.com account" credential (ID: 81ZKNPfmUGTEOCKI)
     - Go to n8n Credentials → Monday.com account
     - Add your Monday.com API token
     - Used for both task creation AND user lookup via GraphQL API

3. **Activate & Use**
   - Activate the workflow
   - Copy the webhook URL from the webhook node
   - Submit POST requests with your project details
   - Watch tasks appear in Monday.com with proper assignments!

## 📝 Input Fields

- **Project Description** (required) - Detailed project description
- **Monday Board ID** (required) - Your board ID number (e.g., `9744010967`)
- **Group ID** (optional) - Leave empty to use "To-Do" group or create new group
- **Group Name** (optional) - Custom name for new group
- **Assignee Emails** (optional) - Comma-separated emails for task assignment

## 🎯 What It Does

1. **Webhook Input** - Receives project details via POST request
2. **Input Validation** - Validates project description and board ID
3. **AI Generation** - Creates 10 realistic tasks using OpenRouter API
4. **Smart Fallbacks** - Uses predefined tasks if AI fails
5. **User Lookup** - Resolves email addresses to Monday.com user IDs
6. **Smart Grouping** - Defaults to "To-Do" group or creates new groups
7. **Rich Task Creation** - Creates tasks with full column data
8. **Column Mapping** - Maps priority, notes, hours, and owner fields
9. **Success Response** - Returns detailed completion summary

## 🔧 Enhanced Features

- ✅ **Email-based Assignment** - Automatically assigns tasks to users by email
- ✅ **User ID Resolution** - Looks up Monday.com user IDs from email addresses via GraphQL API
- ✅ **Smart Group Targeting** - Defaults to "To-Do" group for immediate workflow integration
- ✅ **Proper Column Mapping** - Maps to actual Monday.com column IDs (text9, priority_1, project_owner, numbers)
- ✅ **Dual Credential Support** - Uses both generic and predefined Monday.com credentials for reliability
- ✅ **AI-powered** task generation with robust fallbacks
- ✅ **Input validation** and comprehensive error handling
- ✅ **Conditional flows** for user lookup and assignment
- ✅ **Professional logging** for debugging and monitoring
- ✅ **Production-ready** error handling and workflow stability

## 🏗️ Workflow Architecture

The enhanced workflow includes sophisticated user assignment logic:

1. **User Lookup Prep** - Detects email addresses in assignee fields
2. **Conditional User Lookup** - Only queries Monday API when emails detected  
3. **Monday User API** - Resolves emails to user IDs via GraphQL
4. **User Data Merging** - Combines lookup results with task data
5. **Smart Assignment** - Sets proper owner field or falls back to notes

## 📊 Monday.com Integration

- **Board**: Uses your specified board ID
- **Group**: Creates AI-generated group names or falls back to "To-Do" group (ID: `new_group29179`)
- **Columns**: 
  - `project_owner` (Owner) - User assignment via email lookup
  - `priority_1` (Priority) - High/Medium/Low mapping
  - `text9` (Notes) - Task descriptions and tracked hours info
  - `numbers` (Hours Estimate) - Estimated hours from AI
  - `project_timeline` (Timeline) - Automatic start/end dates for each task
  - `duration_mktkxg1g` (Time Tracking) - Cannot be set via API (Monday.com limitation)

## ✅ **TESTED AND WORKING!**

**Status**: ✅ **FULLY OPERATIONAL** - Successfully tested end-to-end with live API calls

**Recent Test Results**:
- ✅ **OpenRouter AI**: Generates 10 realistic, professional project tasks
- ✅ **Monday.com Integration**: Creates groups and task items successfully
- ✅ **Email Assignment**: Properly resolves email addresses to Monday.com users
- ✅ **Workflow Execution**: Complete webhook → AI → Monday.com pipeline working

**Credential Configuration**:
- **OpenRouter**: Uses predefined "OpenRouter account" credential with dual authentication support (`openRouterApi` + `httpHeaderAuth`)
- **Monday.com**: Uses "Monday.com account" credential (ID: 81ZKNPfmUGTEOCKI) for both task creation and user lookup

**Example Success**: Recent test generated "Recipe Recommender" project with 10 tasks including "Gather Requirements", "Design User Interface", "Build Recommendation Engine" - all properly assigned to specified email address.

## 🎉 Production Ready!

This enhanced workflow provides enterprise-grade task management automation with intelligent user assignment, robust error handling, and proven end-to-end functionality.