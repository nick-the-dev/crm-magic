# 🚀 Monday.com Tasks Generator - Enhanced

Generate 10 realistic project tasks with AI and automatically add them to your Monday.com board with smart email-based user assignment.

## 📁 Files

- `monday-tasks-generator-enhanced.json` - Enhanced n8n workflow with user assignment
- `index.html` - Optional external form interface  
- `README.md` - This file

## ⚡ Quick Setup

1. **Import Workflow**
   - Open n8n
   - Import `monday-tasks-generator-enhanced.json`

2. **Configure Credentials**
   - **OpenRouter API**: Use the predefined "OpenRouter account" credential
     - Go to n8n Credentials → OpenRouter account
     - Add your OpenRouter API key
   - **Monday.com API**: Create Monday.com credential with your API token
     - Used for both task creation AND user lookup

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
- ✅ **User ID Resolution** - Looks up Monday.com user IDs from email addresses
- ✅ **Smart Group Targeting** - Defaults to "To-Do" group for immediate workflow integration
- ✅ **Proper Column Mapping** - Maps to actual Monday.com column IDs (text9, priority_1, project_owner, numbers)
- ✅ **AI-powered** task generation with robust fallbacks
- ✅ **Input validation** and comprehensive error handling
- ✅ **Conditional flows** for user lookup and assignment
- ✅ **Professional logging** for debugging and monitoring

## 🏗️ Workflow Architecture

The enhanced workflow includes sophisticated user assignment logic:

1. **User Lookup Prep** - Detects email addresses in assignee fields
2. **Conditional User Lookup** - Only queries Monday API when emails detected  
3. **Monday User API** - Resolves emails to user IDs via GraphQL
4. **User Data Merging** - Combines lookup results with task data
5. **Smart Assignment** - Sets proper owner field or falls back to notes

## 📊 Monday.com Integration

- **Board**: Uses your specified board ID
- **Group**: Targets "To-Do" group (ID: `new_group29179`) by default
- **Columns**: 
  - `project_owner` (Owner) - User assignment via email lookup
  - `priority_1` (Priority) - High/Medium/Low mapping
  - `text9` (Notes) - Task descriptions and fallback assignee info
  - `numbers` (Hours Estimate) - Estimated hours from AI

## 🎉 Production Ready!

This enhanced workflow provides enterprise-grade task management automation with intelligent user assignment and robust error handling.