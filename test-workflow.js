#!/usr/bin/env node

/**
 * Quick Test Script for Monday.com AI Tasks Generator
 * 
 * This script can be run with n8n MCP tools or adapted for Node.js
 * 
 * Usage with n8n MCP:
 * Just copy the testWorkflow() function content and run it
 */

// Configuration
const CONFIG = {
  webhookUrl: "https://automations-n8n.u841sv.easypanel.host/webhook/monday-tasks",
  workflowId: "6IDxhXNS4X028T1O",
  boardId: "9744010967",
  testEmail: "gluknik+1@gmail.com"
};

// Test payloads
const TEST_PAYLOADS = {
  default: {
    projectDescription: "Build an AI-powered customer feedback analysis system that automatically categorizes and prioritizes customer feedback",
    boardId: CONFIG.boardId,
    assigneeEmails: CONFIG.testEmail
  },
  ecommerce: {
    projectDescription: "Create a responsive e-commerce website with payment integration, inventory management, and customer analytics",
    boardId: CONFIG.boardId,
    assigneeEmails: CONFIG.testEmail
  },
  mobile: {
    projectDescription: "Develop a fitness tracking mobile app for iOS and Android with social features and wearable integration",
    boardId: CONFIG.boardId,
    assigneeEmails: CONFIG.testEmail
  },
  data: {
    projectDescription: "Build a real-time analytics dashboard for sales performance with predictive modeling and alerts",
    boardId: CONFIG.boardId,
    assigneeEmails: CONFIG.testEmail
  }
};

/**
 * Main test function - Copy this for n8n MCP tools
 */
async function testWorkflow(payloadType = 'default') {
  const payload = TEST_PAYLOADS[payloadType] || TEST_PAYLOADS.default;
  
  console.log('🚀 Testing Monday.com AI Tasks Generator');
  console.log('📋 Payload:', JSON.stringify(payload, null, 2));
  console.log('🔗 Webhook URL:', CONFIG.webhookUrl);
  console.log('');
  
  // For n8n MCP tools, use this:
  /*
  const result = await mcp__n8n-mcp__n8n_trigger_webhook_workflow({
    webhookUrl: CONFIG.webhookUrl,
    httpMethod: "POST",
    data: payload,
    waitForResponse: true
  });
  */
  
  // For Node.js with fetch:
  try {
    const response = await fetch(CONFIG.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ SUCCESS!');
      console.log(`📊 Created ${result.tasksCreated} tasks`);
      console.log(`🎯 Board ID: ${result.boardId || CONFIG.boardId}`);
      console.log(`⏰ Timestamp: ${result.timestamp}`);
    } else {
      console.log('❌ FAILED!');
      console.log('Error:', result.error || 'Unknown error');
    }
    
    return result;
  } catch (error) {
    console.log('❌ Connection Error!');
    console.log('Error:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Check workflow status - Copy this for n8n MCP tools
 */
async function checkWorkflowStatus() {
  console.log('🔍 Checking workflow status...');
  
  // For n8n MCP tools:
  /*
  const workflows = await mcp__n8n-mcp__n8n_list_workflows({ limit: 50 });
  const workflow = workflows.data.workflows.find(w => w.id === CONFIG.workflowId);
  
  if (workflow) {
    console.log(`📌 Workflow: ${workflow.name}`);
    console.log(`🟢 Status: ${workflow.active ? 'ACTIVE' : 'INACTIVE'}`);
    console.log(`📅 Updated: ${workflow.updatedAt}`);
    return workflow.active;
  } else {
    console.log('❌ Workflow not found!');
    return false;
  }
  */
}

/**
 * Get last execution - Copy this for n8n MCP tools
 */
async function getLastExecution() {
  console.log('📊 Getting last execution...');
  
  // For n8n MCP tools:
  /*
  const executions = await mcp__n8n-mcp__n8n_list_executions({
    workflowId: CONFIG.workflowId,
    limit: 1,
    includeData: false
  });
  
  if (executions.data.executions.length > 0) {
    const exec = executions.data.executions[0];
    console.log(`🆔 Execution ID: ${exec.id}`);
    console.log(`📅 Started: ${exec.startedAt}`);
    console.log(`⏱️ Duration: ${new Date(exec.stoppedAt) - new Date(exec.startedAt)}ms`);
    console.log(`✅ Finished: ${exec.finished}`);
    return exec;
  } else {
    console.log('No executions found');
    return null;
  }
  */
}

// If running as Node.js script
if (require.main === module) {
  console.log('================================');
  console.log('Monday.com AI Tasks Generator Test');
  console.log('================================\n');
  
  // Parse command line arguments
  const args = process.argv.slice(2);
  const command = args[0] || 'test';
  const payload = args[1] || 'default';
  
  switch(command) {
    case 'test':
      testWorkflow(payload).then(result => {
        process.exit(result.success ? 0 : 1);
      });
      break;
    case 'status':
      checkWorkflowStatus();
      break;
    case 'last':
      getLastExecution();
      break;
    default:
      console.log('Usage: node test-workflow.js [command] [payload]');
      console.log('Commands: test, status, last');
      console.log('Payloads: default, ecommerce, mobile, data');
  }
}

// Export for use in other scripts
module.exports = {
  CONFIG,
  TEST_PAYLOADS,
  testWorkflow,
  checkWorkflowStatus,
  getLastExecution
};