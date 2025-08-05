# 🚀 Monday.com Tasks Generator

Generate 10 realistic project tasks with AI and automatically add them to your Monday.com board.

## 📁 Files

- `monday-tasks-generator.json` - Complete n8n workflow
- `index.html` - Optional external form interface  
- `README.md` - This file

## ⚡ Quick Setup

1. **Import Workflow**
   - Open n8n
   - Import `monday-tasks-generator.json`

2. **Configure Credentials**
   - **OpenRouter API**: Create HTTP Header Auth credential
     - Header: `Authorization`
     - Value: `Bearer YOUR_OPENROUTER_API_KEY`
   - **Monday.com API**: Create Monday.com credential with your API token

3. **Activate & Use**
   - Activate the workflow
   - Copy the form URL from the Form Trigger node
   - Fill out the form with your project details
   - Watch tasks appear in Monday.com!

## 📝 Form Fields

- **Project Description** (required) - Detailed project description
- **Monday Board ID** (required) - Your board ID number
- **Group ID** (optional) - Leave empty to create new group
- **Group Name** (optional) - Custom name for new group

## 🎯 What It Does

1. **Form Input** - Clean web form for project details
2. **AI Generation** - Creates 10 realistic tasks using OpenRouter
3. **Smart Fallbacks** - Uses predefined tasks if AI fails
4. **Monday Integration** - Creates group and tasks automatically
5. **Rich Details** - Adds descriptions, priorities, time estimates
6. **Success Response** - Shows detailed completion summary

## 🔧 Features

- ✅ **AI-powered** task generation with fallbacks
- ✅ **Form validation** and error handling
- ✅ **Automatic grouping** in Monday.com
- ✅ **Rich task details** with priorities and estimates
- ✅ **Professional UI** with loading states
- ✅ **Complete workflow** in one file

## 🎉 Ready to Use!

The workflow includes everything you need - just import, configure credentials, and start generating tasks!